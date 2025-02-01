import { DriverLicenseRepository } from "../../repositories/DriverLicenseRepository";
import { DriverLicenseNotFoundError } from "../../../domain/errors/DriverLicenseNotFoundError";
import { LicenseCategory } from "../../../domain/types/LicenseCategory";
import { InvalidLicenseDate } from "../../../domain/errors/InvalidLicenseDate";

export class EditDriverLicense {
  public constructor(
    private readonly driverLicenseRepository: DriverLicenseRepository
  ) {}

  public async execute(
    id: string,
    licenseNumber: string,
    issueDate: Date,
    expirationDate: Date,
    status: string,
    categories: string[]
  ) {
    const driverLicense = await this.driverLicenseRepository.findById(id);
    if (!driverLicense) {
      return new DriverLicenseNotFoundError();
    }

    const licenseCategories = LicenseCategory.from(categories);
    if (licenseCategories instanceof Error) {
      return licenseCategories;
    }

    if (
      issueDate > expirationDate ||
      issueDate > new Date() ||
      expirationDate < new Date()
    ) {
      return new InvalidLicenseDate();
    }

    const updatedDriverLicense = driverLicense.update(
      licenseNumber,
      issueDate,
      expirationDate,
      status,
      licenseCategories
    );

    await this.driverLicenseRepository.save(updatedDriverLicense);
  }
}
