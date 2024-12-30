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
    public driverLicenseId: string
  ) {}

  public static create(
    firstName: string,
    lastName: string,
    phone: string,
    email: string,
    birthDate: Date,
    companyId: string,
    driverLicenseId: string
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
      driverLicenseId
    );
  }
}
