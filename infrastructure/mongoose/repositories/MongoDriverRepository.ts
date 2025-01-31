import { Connection } from "mongoose";
import { DriverRepository } from "../../../application/repositories/DriverRepository";
import { DriverEntity } from "../../../domain/entities/DriverEntity";
import { CompanySchema } from "../schemas/CompanySchema";

export class MongoDriverRepository implements DriverRepository {
  private companyModel;

  constructor(connection: Connection) {
    // On utilise le model Company car les drivers sont stockés comme sous-documents
    this.companyModel = connection.model("CompanyEntity", CompanySchema);
  }

  async save(driver: DriverEntity): Promise<void> {
    const existingDriver = await this.findById(driver.id);

    if (existingDriver) {
      // Mise à jour d'un driver existant
      await this.companyModel.updateOne(
        {
          id: driver.companyId,
          "drivers.id": driver.id, // On cherche le driver par son ID
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
              driverLicenseId: driver.driverLicenseId,
            },
          },
        }
      );
    } else {
      // Ajout d'un nouveau driver
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
              driverLicenseId: driver.driverLicenseId,
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

    // Utiliser restore au lieu de create pour garder l'ID original
    return DriverEntity.restore(
      driver.id,
      driver.firstName,
      driver.lastName,
      driver.phone,
      driver.email,
      driver.birthDate,
      company.id,
      driver.driverLicenseId,
      driver.createdAt,
      driver.updatedAt
    );
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
        driver.driverLicenseId,
        driver.createdAt,
        driver.updatedAt
      )
    );
  }
}
