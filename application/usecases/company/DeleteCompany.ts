import { CompanyRepository } from "../../repositories/CompanyRepository";

export class DeleteCompany {
  public constructor(private readonly companyRepository: CompanyRepository) {}

  public async execute(id: string) {
    await this.companyRepository.delete(id);
  }
}
