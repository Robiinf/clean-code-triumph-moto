import type { DriverLicenseRepository } from "../../repositories/DriverLicenseRepository";

export class ListAllDriverLicense {
  public constructor(
    private readonly driverLicenseRepository: DriverLicenseRepository
  ) {}

  public execute() {
    return this.driverLicenseRepository.findAll();
  }
}
