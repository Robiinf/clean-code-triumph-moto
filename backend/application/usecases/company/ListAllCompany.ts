import type { CompanyRepository } from "../../repositories/CompanyRepository";
import { CompanyEntity } from "../../../domain/entities/CompanyEntity";

export class ListAllCompany {
  public constructor(private readonly companyRepository: CompanyRepository) {}

  public execute(): Promise<CompanyEntity[]> {
    return this.companyRepository.findAll();
  }
}
