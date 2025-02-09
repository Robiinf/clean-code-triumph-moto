import { Connection } from "mongoose";
import { DriverRepository } from "../../../application/repositories/DriverRepository";
import { DriverEntity } from "../../../domain/entities/DriverEntity";
import { CompanySchema } from "../schemas/CompanySchema";

export class MongoDriverRepository implements DriverRepository {
  private companyModel;

  constructor(connection: Connection) {
    this.companyModel = connection.model("CompanyEntity", CompanySchema);
  }

  async save(driver: DriverEntity): Promise<void> {
    const existingDriver = await this.findById(driver.id);

    if (existingDriver) {
      await this.companyModel.updateOne(
        {
          id: driver.companyId,
          "drivers.id": driver.id,
        },
        {
          $set: {
            "drivers.$": {
              id: driver.id,
              firstName: driver.firstName,
              lastName: driver.lastName,
              phone: driver.phone,
              email: driver.email,
              birthDate: driver.birthDate,
              createdAt: driver.createdAt,
              updatedAt: driver.updatedAt,
              driverLicense: driver.driverLicenseId
                ? { id: driver.driverLicenseId }
                : null,
            },
          },
        }
      );
    } else {
      await this.companyModel.updateOne(
        { id: driver.companyId },
        {
          $push: {
            drivers: {
              id: driver.id,
              firstName: driver.firstName,
              lastName: driver.lastName,
              phone: driver.phone,
              email: driver.email,
              birthDate: driver.birthDate,
              createdAt: driver.createdAt,
              updatedAt: driver.updatedAt,
              driverLicense: driver.driverLicenseId
                ? { id: driver.driverLicenseId }
                : null,
            },
          },
        }
      );
    }
  }

  async findById(id: string): Promise<DriverEntity | null> {
    const company = await this.companyModel.findOne(
      { "drivers.id": id },
      { "drivers.$": 1, id: 1 }
    );

    if (!company || !company.drivers || !company.drivers.length) {
      return null;
    }

    const driver = company.drivers[0];

    const driverLicenseId = driver.driverLicense?.id || null;
    const restoredDriver = DriverEntity.restore(
      driver.id,
      driver.firstName,
      driver.lastName,
      driver.phone,
      driver.email,
      driver.birthDate,
      company.id,
      driverLicenseId,
      driver.createdAt,
      driver.updatedAt
    );

    return restoredDriver;
  }

  async findByCompany(companyId: string): Promise<DriverEntity[]> {
    const company = await this.companyModel.findOne({ id: companyId });

    if (!company || !company.drivers) {
      return [];
    }

    return company.drivers.map((driver) =>
      DriverEntity.restore(
        driver.id,
        driver.firstName,
        driver.lastName,
        driver.phone,
        driver.email,
        driver.birthDate,
        companyId,
        driver.driverLicense?.id || null,
        driver.createdAt,
        driver.updatedAt
      )
    );
  }

  async delete(id: string): Promise<void> {
    const existingDriver = await this.findById(id);
    const result = await this.companyModel.updateOne(
      { id: existingDriver.companyId },
      {
        $pull: {
          drivers: { id: id },
        },
      }
    );
  }

  async findByDriverLicenseId(licenseId: string): Promise<DriverEntity | null> {
    const company = await this.companyModel.findOne(
      { "drivers.driverLicense.id": licenseId },
      { "drivers.$": 1, id: 1 }
    );

    if (!company || !company.drivers || !company.drivers.length) {
      return null;
    }

    const driver = company.drivers[0];
    return DriverEntity.restore(
      driver.id,
      driver.firstName,
      driver.lastName,
      driver.phone,
      driver.email,
      driver.birthDate,
      company.id,
      driver.driverLicense?.id,
      driver.createdAt,
      driver.updatedAt
    );
  }
}
