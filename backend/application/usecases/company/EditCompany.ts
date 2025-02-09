import type { CompanyRepository } from "../../repositories/CompanyRepository";
import { CompanyName } from "../../../domain/types/CompanyName";
import { CompanySiret } from "../../../domain/types/CompanySiret";
import { CompanyNotFound } from "../../../domain/errors/CompanyNotFound";

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
      return new CompanyNotFound();
    }

    const companyName = CompanyName.from(name);
    if (companyName instanceof Error) {
      return companyName;
    }
    const companySiret = CompanySiret.from(siret);
    if (companySiret instanceof Error) {
      return companySiret;
    }

    const updatedCompany = company.update(
      companyName,
      companySiret,
      phone,
      address,
      city,
      postalCode,
      country
    );

    await this.companyRepository.save(updatedCompany);
  }
}
