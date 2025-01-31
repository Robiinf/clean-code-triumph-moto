import crypto from "crypto";

export class DriverEntity {
  private constructor(
    public id: string,
    public firstName: string,
    public lastName: string,
    public phone: string,
    public email: string,
    public birthDate: Date,
    public createdAt: Date,
    public updatedAt: Date,
    public companyId: string,
    public driverLicenseId: string | null
  ) {}

  public static create(
    firstName: string,
    lastName: string,
    phone: string,
    email: string,
    birthDate: Date,
    companyId: string,
    driverLicenseId?: string
  ): DriverEntity {
    const id = crypto.randomUUID();
    const createdAt = new Date();
    const updatedAt = new Date();
    return new DriverEntity(
      id,
      firstName,
      lastName,
      phone,
      email,
      birthDate,
      createdAt,
      updatedAt,
      companyId,
      driverLicenseId || null
    );
  }

  public static restore(
    id: string,
    firstName: string,
    lastName: string,
    phone: string,
    email: string,
    birthDate: Date,
    companyId: string,
    driverLicenseId: string | null,
    createdAt: Date,
    updatedAt: Date
  ): DriverEntity {
    return new DriverEntity(
      id,
      firstName,
      lastName,
      phone,
      email,
      birthDate,
      createdAt,
      updatedAt,
      companyId,
      driverLicenseId
    );
  }

  public update(
    firstName: string,
    lastName: string,
    phone: string,
    email: string,
    birthDate: Date,
    companyId: string,
    driverLicenseId?: string
  ): DriverEntity {
    return DriverEntity.restore(
      this.id,
      firstName,
      lastName,
      phone,
      email,
      birthDate,
      companyId,
      driverLicenseId || null,
      this.createdAt,
      new Date()
    );
  }
}
