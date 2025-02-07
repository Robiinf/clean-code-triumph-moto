import { CompanyEntity } from "../../../domain/entities/CompanyEntity";
import type { CompanyRepository } from "../../repositories/CompanyRepository";
import { CompanyName } from "../../../domain/types/CompanyName";
import { CompanySiret } from "../../../domain/types/CompanySiret";
import { CompanyNameTooShortError } from "../../../domain/errors/CompanyNameTooShortError";
import { InvalidSiretError } from "../../../domain/errors/InvalidSiretError";

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
  ): Promise<void | CompanyNameTooShortError | InvalidSiretError> {
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
