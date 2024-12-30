import { LicenseCategory } from "../types/LicenseCategory";

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
  ) {
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
}
