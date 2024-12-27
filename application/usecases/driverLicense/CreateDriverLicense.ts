import { DriverLicenseEntity } from "../../../domain/entities/DriverLicenseEntity";
import type { DriverLicenseRepository } from "../../repositories/DriverLicenseRepository";
import { LicenseCategory } from "../../../domain/types/LicenseCategory";
import { InvalidLicenseDate } from "../../../domain/errors/InvalidLicenseDate";

export class CreateDriverLicense {
  public constructor(
    private readonly driverLicenseRepository: DriverLicenseRepository
  ) {}

  public async execute(
    licenseNumber: string,
    issueDate: Date,
    expirationDate: Date,
    status: string,
    categories: string[]
  ) {
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

    const driverLicense = DriverLicenseEntity.create(
      licenseNumber,
      issueDate,
      expirationDate,
      status,
      licenseCategories
    );

    await this.driverLicenseRepository.save(driverLicense);
  }
}
