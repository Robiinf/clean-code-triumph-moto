import type { DriverLicenseRepository } from "../../repositories/DriverLicenseRepository";
import { DriverLicenseNotFoundError } from "../../../domain/errors/DriverLicenseNotFoundError";

export class GetDriverLicense {
  public constructor(
    private readonly driverLicenseRepository: DriverLicenseRepository
  ) {}

  public async execute(id: string) {
    const driverLicense = await this.driverLicenseRepository.findById(id);
    if (!driverLicense) {
      return new DriverLicenseNotFoundError();
    }

    return driverLicense;
  }
}
