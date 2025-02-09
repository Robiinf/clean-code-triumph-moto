import type { CompanyEntity } from "../../domain/entities/CompanyEntity";

export interface CompanyRepository {
  save(company: CompanyEntity): Promise<void>;
  findById(id: string): Promise<CompanyEntity | null>;
  findAll(): Promise<CompanyEntity[]>;
  delete(id: string): Promise<void>;
}
