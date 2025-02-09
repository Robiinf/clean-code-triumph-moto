import { LicenseCategory } from "../types/LicenseCategory";
import crypto from "crypto";

export class DriverLicenseEntity {
  private constructor(
    public id: string,
    public licenseNumber: string,
    public issueDate: Date,
    public expirationDate: Date,
    public status: string,
    public categories: LicenseCategory[]
  ) {}

  public static create(
    licenseNumber: string,
    issueDate: Date,
    expirationDate: Date,
    status: string,
    categories: LicenseCategory[]
  ): DriverLicenseEntity {
    const id = crypto.randomUUID();
    return new DriverLicenseEntity(
      id,
      licenseNumber,
      issueDate,
      expirationDate,
      status,
      categories
    );
  }

  public static restore(
    id: string,
    licenseNumber: string,
    issueDate: Date,
    expirationDate: Date,
    status: string,
    categories: LicenseCategory[]
  ): DriverLicenseEntity {
    return new DriverLicenseEntity(
      id,
      licenseNumber,
      issueDate,
      expirationDate,
      status,
      categories
    );
  }

  public update(
    licenseNumber: string,
    issueDate: Date,
    expirationDate: Date,
    status: string,
    categories: LicenseCategory[]
  ): DriverLicenseEntity {
    return DriverLicenseEntity.restore(
      this.id,
      licenseNumber,
      issueDate,
      expirationDate,
      status,
      categories
    );
  }
}
