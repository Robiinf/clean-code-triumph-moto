import { DriverLicenseEntity } from "../../../domain/entities/DriverLicenseEntity";
import type { DriverLicenseRepository } from "../../repositories/DriverLicenseRepository";
import type { DriverRepository } from "../../repositories/DriverRepository";
import { LicenseCategory } from "../../../domain/types/LicenseCategory";
import { InvalidLicenseDate } from "../../../domain/errors/InvalidLicenseDate";
import { DriverNotFound } from "../../../domain/errors/DriverNotFound";
import { InvalidLicenseCategory } from "../../../domain/errors/InvalidLicenseCategory";

export class AddDriverLicense {
  public constructor(
    private readonly driverLicenseRepository: DriverLicenseRepository,
    private readonly driverRepository: DriverRepository
  ) {}

  public async execute(
    licenseNumber: string,
    issueDate: Date,
    expirationDate: Date,
    status: string,
    categories: string[],
    driverId: string
  ): Promise<
    void | DriverNotFound | InvalidLicenseDate | InvalidLicenseCategory
  > {
    const driver = await this.driverRepository.findById(driverId);
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

    const driverLicense = DriverLicenseEntity.create(
      licenseNumber,
      issueDate,
      expirationDate,
      status,
      licenseCategories
    );

    const updatedDriver = driver.update(
      driver.firstName,
      driver.lastName,
      driver.phone,
      driver.email,
      driver.birthDate,
      driver.companyId,
      driverLicense.id
    );

    await this.driverRepository.save(updatedDriver);
    await this.driverLicenseRepository.save(driverLicense, driverId);
  }
}
