import { CompanyEntity } from "../../../domain/entities/CompanyEntity";
import type { CompanyRepository } from "../../repositories/CompanyRepository";
import { CompanyName } from "../../../domain/types/CompanyName";
import { CompanySiret } from "../../../domain/types/CompanySiret";

export class CreateCompany {
  public constructor(private readonly companyRepository: CompanyRepository) {}

  public async execute(
    name: string,
    siret: string,
    phone: string,
    address: string,
    city: string,
    postalCode: string,
    country: string
  ) {
    const companyName = CompanyName.from(name);
    if (companyName instanceof Error) {
      return companyName;
    }
    const companySiret = CompanySiret.from(siret);
    if (companySiret instanceof Error) {
      return companySiret;
    }

    const company = CompanyEntity.create(
      companyName,
      companySiret,
      phone,
      address,
      city,
      postalCode,
      country
    );

    await this.companyRepository.save(company);
  }
}
