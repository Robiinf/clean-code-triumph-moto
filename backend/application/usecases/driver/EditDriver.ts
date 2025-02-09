import type { DriverRepository } from "../../repositories/DriverRepository";
import { DriverNotFound } from "../../../domain/errors/DriverNotFound";

export class EditDriver {
  public constructor(private readonly driverRepository: DriverRepository) {}

  public async execute(
    id: string,
    firstName: string,
    lastName: string,
    phone: string,
    email: string,
    birthDate: Date,
    companyId: string
  ) {
    const driver = await this.driverRepository.findById(id);

    if (!driver) {
      return new DriverNotFound();
    }

    const updatedDriver = driver.update(
      firstName,
      lastName,
      phone,
      email,
      birthDate,
      companyId,
      driver.driverLicenseId
    );

    await this.driverRepository.save(updatedDriver);
  }
}
