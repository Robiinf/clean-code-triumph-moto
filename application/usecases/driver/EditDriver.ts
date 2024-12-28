import type { DriverRepository } from "../../repositories/DriverRepository";

export class EditDriver {
  public constructor(private readonly driverRepository: DriverRepository) {}

  public async execute(
    id: string,
    firstName: string,
    lastName: string,
    phone: string,
    email: string,
    birthDate: Date,
    companyId: string,
    DriverLicenseId: string
  ) {
    const driver = await this.driverRepository.findById(id);

    if (!driver) {
      throw new Error("Driver not found");
    }

    driver.firstName = firstName;
    driver.lastName = lastName;
    driver.phone = phone;
    driver.email = email;
    driver.birthDate = birthDate;
    driver.companyId = companyId;
    driver.DriverLicenseId = DriverLicenseId;

    await this.driverRepository.save(driver);
  }
}
