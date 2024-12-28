import type { DriverRepository } from "../../repositories/DriverRepository";
import { DriverEntity } from "../../../domain/entities/DriverEntity";

export class AddDriver {
  public constructor(private readonly driverRepository: DriverRepository) {}

  public async execute(
    firstName: string,
    lastName: string,
    phone: string,
    email: string,
    birthDate: Date,
    companyId: string,
    DriverLicenseId: string
  ) {
    const driver = DriverEntity.create(
      firstName,
      lastName,
      phone,
      email,
      birthDate,
      companyId,
      DriverLicenseId
    );

    await this.driverRepository.save(driver);
  }
}
