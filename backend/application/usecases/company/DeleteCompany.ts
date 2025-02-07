import { CompanyRepository } from "../../repositories/CompanyRepository";
import { CompanyNotFound } from "../../../domain/errors/CompanyNotFound";

export class DeleteCompany {
  public constructor(private readonly companyRepository: CompanyRepository) {}

  public async execute(id: string): Promise<void | CompanyNotFound> {
    const company = await this.companyRepository.findById(id);
    if (!company) {
      return new CompanyNotFound();
    }
    await this.companyRepository.delete(id);
  }
}
