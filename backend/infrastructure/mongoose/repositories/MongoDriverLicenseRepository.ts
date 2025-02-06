import { Connection } from "mongoose";
import { DriverLicenseRepository } from "../../../application/repositories/DriverLicenseRepository";
import { DriverLicenseEntity } from "../../../domain/entities/DriverLicenseEntity";
import { CompanySchema } from "../schemas/CompanySchema";
import { LicenseCategory } from "../../../domain/types/LicenseCategory";

export class MongoDriverLicenseRepository implements DriverLicenseRepository {
  private companyModel;

  constructor(connection: Connection) {
    this.companyModel = connection.model("CompanyEntity", CompanySchema);
  }

  async save(
    driverLicense: DriverLicenseEntity,
    driverId: string
  ): Promise<void> {
    const categoryValues = driverLicense.categories.map((cat) => cat.value);
    const existingLicense = await this.findById(driverLicense.id);

    if (existingLicense) {
      await this.companyModel.updateOne(
        { "drivers.driverLicense.id": driverLicense.id },
        {
          $set: {
            "drivers.$.driverLicense": {
              id: driverLicense.id,
              licenseNumber: driverLicense.licenseNumber,
              issueDate: driverLicense.issueDate,
              expirationDate: driverLicense.expirationDate,
              status: driverLicense.status,
              categories: categoryValues,
            },
          },
        }
      );
    } else {
      await this.companyModel.updateOne(
        { "drivers.id": driverId },
        {
          $set: {
            "drivers.$.driverLicense": {
              id: driverLicense.id,
              licenseNumber: driverLicense.licenseNumber,
              issueDate: driverLicense.issueDate,
              expirationDate: driverLicense.expirationDate,
              status: driverLicense.status,
              categories: categoryValues,
            },
          },
        }
      );
    }
  }

  async findById(id: string): Promise<DriverLicenseEntity | null> {
    const company = await this.companyModel.findOne(
      { "drivers.driverLicense.id": id },
      { "drivers.$": 1 }
    );

    if (!company || !company.drivers || !company.drivers[0].driverLicense) {
      return null;
    }

    const license = company.drivers[0].driverLicense;

    const categoryStrings = Array.isArray(license.categories)
      ? license.categories
      : [];
    const licenseCategories = LicenseCategory.from(categoryStrings);

    if (licenseCategories instanceof Error) {
      return null;
    }

    return DriverLicenseEntity.restore(
      license.id,
      license.licenseNumber,
      license.issueDate,
      license.expirationDate,
      license.status,
      licenseCategories
    );
  }

  async findByDriver(driverId: string): Promise<DriverLicenseEntity | null> {
    const company = await this.companyModel.findOne(
      { "drivers.id": driverId },
      { "drivers.$": 1 }
    );

    if (!company || !company.drivers || !company.drivers[0].driverLicense) {
      return null;
    }

    const license = company.drivers[0].driverLicense;

    const categoryStrings = Array.isArray(license.categories)
      ? license.categories
      : [];
    const licenseCategories = LicenseCategory.from(categoryStrings);

    if (licenseCategories instanceof Error) {
      throw new Error("Invalid license category in database");
    }

    return DriverLicenseEntity.restore(
      license.id,
      license.licenseNumber,
      license.issueDate,
      license.expirationDate,
      license.status,
      licenseCategories
    );
  }

  async delete(id: string): Promise<void> {
    const allCompanies = await this.companyModel.find({});

    const companyWithDriver = await this.companyModel.findOne({
      drivers: {
        $elemMatch: {
          "driverLicense.id": id,
        },
      },
    });

    const result = await this.companyModel.updateOne(
      {
        "drivers.driverLicense.id": id,
      },
      {
        $set: {
          "drivers.$.driverLicense": null,
        },
      }
    );

    if (result.modifiedCount === 0) {
      throw new Error("License not found");
    }
  }
}
