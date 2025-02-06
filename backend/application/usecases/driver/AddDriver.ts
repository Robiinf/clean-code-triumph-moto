import type { DriverRepository } from "../../repositories/DriverRepository";
import { DriverEntity } from "../../../domain/entities/DriverEntity";
import { CompanyRepository } from "../../repositories/CompanyRepository";
import { CompanyNotFound } from "../../../domain/errors/CompanyNotFound";

export class AddDriver {
  public constructor(
    private readonly driverRepository: DriverRepository,
    private readonly companyRepository: CompanyRepository
  ) {}

  public async execute(
    firstName: string,
    lastName: string,
    phone: string,
    email: string,
    birthDate: Date,
    companyId: string,
    driverLicenseId?: string
  ) {
    const company = await this.companyRepository.findById(companyId);
    if (!company) {
      return new CompanyNotFound();
    }

    const driver = DriverEntity.create(
      firstName,
      lastName,
      phone,
      email,
      birthDate,
      companyId,
      driverLicenseId
    );

    await this.driverRepository.save(driver);
  }
}
