import type { CompanyRepository } from "../../repositories/CompanyRepository";
import { CompanyName } from "../../../domain/types/CompanyName";
import { CompanySiret } from "../../../domain/types/CompanySiret";

export class EditCompany {
  public constructor(private readonly companyRepository: CompanyRepository) {}

  public async execute(
    companyId: string,
    name: string,
    siret: string,
    phone: string,
    address: string,
    city: string,
    postalCode: string,
    country: string
  ) {
    const company = await this.companyRepository.findById(companyId);

    if (!company) {
      return new Error("CompanyNotFound");
    }

    const companyName = CompanyName.from(name);
    if (companyName instanceof Error) {
      return companyName;
    }
    const companySiret = CompanySiret.from(siret);
    if (companySiret instanceof Error) {
      return companySiret;
    }

    company.name = companyName;
    company.siret = companySiret;
    company.phone = phone;
    company.address = address;
    company.city = city;
    company.postalCode = postalCode;
    company.country = country;

    await this.companyRepository.save(company);
  }
}
