import type { CompanyRepository } from "../../repositories/CompanyRepository";
import { CompanyNotFound } from "../../../domain/errors/CompanyNotFound";

export class GetCompanyById {
  public constructor(private readonly companyRepository: CompanyRepository) {}

  public execute(id: string) {
    const company = this.companyRepository.findById(id);
    if (!company) {
      return new CompanyNotFound();
    }
    return company;
  }
}
