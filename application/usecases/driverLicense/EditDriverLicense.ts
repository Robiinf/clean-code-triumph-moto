import { DriverLicenseRepository } from "../../repositories/DriverLicenseRepository";
import { DriverRepository } from "../../repositories/DriverRepository";
import { DriverLicenseNotFoundError } from "../../../domain/errors/DriverLicenseNotFoundError";
import { LicenseCategory } from "../../../domain/types/LicenseCategory";
import { InvalidLicenseDate } from "../../../domain/errors/InvalidLicenseDate";
import { DriverNotFound } from "../../../domain/errors/DriverNotFound";

export class EditDriverLicense {
  public constructor(
    private readonly driverLicenseRepository: DriverLicenseRepository,
    private readonly driverRepository: DriverRepository
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

    // Trouver le driver associé à cette licence
    const driver = await this.driverRepository.findByDriverLicenseId(id);
    if (!driver) {
      return new DriverNotFound();
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

    await this.driverLicenseRepository.save(updatedDriverLicense, driver.id);
  }
}
