import type { CompanyRepository } from "../../repositories/CompanyRepository";
import { CompanyNotFound } from "../../../domain/errors/CompanyNotFound";
import { CompanyEntity } from "../../../domain/entities/CompanyEntity";

export class GetCompanyById {
  public constructor(private readonly companyRepository: CompanyRepository) {}

  public execute(id: string): CompanyNotFound | Promise<CompanyEntity> {
    const company = this.companyRepository.findById(id);
    if (!company) {
      return new CompanyNotFound();
    }
    return company;
  }
}
