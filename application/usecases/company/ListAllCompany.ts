import type { CompanyRepository } from "../../repositories/CompanyRepository";

export class ListAllCompany {
  public constructor(private readonly companyRepository: CompanyRepository) {}

  public execute() {
    return this.companyRepository.findAll();
  }
}
