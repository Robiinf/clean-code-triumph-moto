import type { DriverLicenseRepository } from "../../repositories/DriverLicenseRepository";
import { LicenseCategory } from "../../../domain/types/LicenseCategory";
import { DriverLicenseNotFoundError } from "../../../domain/errors/DriverLicenseNotFoundError";

export class EditDriverLicense {
  public constructor(
    private readonly driverLicenseRepository: DriverLicenseRepository
  ) {}

  public async execute(
    driverLicenseId: string,
    licenseNumber: string,
    categories: string[],
    expirationDate: Date
  ) {
    const driverLicense = await this.driverLicenseRepository.findById(
      driverLicenseId
    );

    if (!driverLicense) {
      return new DriverLicenseNotFoundError();
    }

    const licenseCategories = LicenseCategory.from(categories);
    if (licenseCategories instanceof Error) {
      return licenseCategories;
    }

    driverLicense.licenseNumber = licenseNumber;
    driverLicense.categories = licenseCategories;
    driverLicense.expirationDate = expirationDate;

    await this.driverLicenseRepository.save(driverLicense);
  }
}
