import type { DriverLicenseRepository } from "../../repositories/DriverLicenseRepository";
import type { DriverRepository } from "../../repositories/DriverRepository";
import { DriverNotFound } from "../../../domain/errors/DriverNotFound";
import { DriverLicenseNotFoundError } from "../../../domain/errors/DriverLicenseNotFoundError";

export class RemoveDriverLicense {
  public constructor(
    private readonly driverLicenseRepository: DriverLicenseRepository,
    private readonly driverRepository: DriverRepository
  ) {}

  public async execute(id: string) {
    const driverLicense = await this.driverLicenseRepository.findById(id);
    if (!driverLicense) {
      return new DriverLicenseNotFoundError();
    }

    const driver = await this.driverRepository.findByDriverLicenseId(id);
    if (!driver) {
      return new DriverNotFound();
    }

    await this.driverLicenseRepository.delete(id);

    const updatedDriver = driver.update(
      driver.firstName,
      driver.lastName,
      driver.phone,
      driver.email,
      driver.birthDate,
      driver.companyId,
      null
    );

    await this.driverRepository.save(updatedDriver);
  }
}
