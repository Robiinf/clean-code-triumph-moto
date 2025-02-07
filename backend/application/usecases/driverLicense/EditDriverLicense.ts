import { DriverLicenseRepository } from "../../repositories/DriverLicenseRepository";
import { DriverRepository } from "../../repositories/DriverRepository";
import { DriverLicenseNotFoundError } from "../../../domain/errors/DriverLicenseNotFoundError";
import { LicenseCategory } from "../../../domain/types/LicenseCategory";
import { InvalidLicenseDate } from "../../../domain/errors/InvalidLicenseDate";
import { DriverNotFound } from "../../../domain/errors/DriverNotFound";
import { InvalidLicenseCategory } from "../../../domain/errors/InvalidLicenseCategory";

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
  ): Promise<
    | void
    | DriverLicenseNotFoundError
    | DriverNotFound
    | InvalidLicenseDate
    | InvalidLicenseCategory
  > {
    const driverLicense = await this.driverLicenseRepository.findById(id);
    if (!driverLicense) {
      return new DriverLicenseNotFoundError();
    }

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
