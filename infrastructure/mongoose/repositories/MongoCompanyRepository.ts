import { Connection } from "mongoose";
import { CompanyEntity } from "../../../domain/entities/CompanyEntity";
import { CompanyRepository } from "../../../application/repositories/CompanyRepository";
import {
  CompanySchema,
  CompanyDocument,
  CompanyModel,
} from "../schemas/CompanySchema";

export class MongoCompanyRepository implements CompanyRepository {
  private companyModel;

  constructor(connection: Connection) {
    this.companyModel = connection.model<CompanyDocument>(
      "CompanyEntity",
      CompanySchema
    );
  }

  private toEntity(document: CompanyDocument): CompanyEntity {
    return CompanyEntity.restore(
      document.id,
      document.name,
      document.siret,
      document.phone,
      document.address,
      document.city,
      document.postalCode,
      document.country,
      document.createdAt,
      document.updatedAt
    );
  }

  async findById(id: string): Promise<CompanyEntity | null> {
    const company = await this.companyModel.findOne({ id });
    if (!company) {
      return null;
    }
    return this.toEntity(company);
  }

  async findAll(): Promise<CompanyEntity[]> {
    const companies = await this.companyModel.find();
    return companies.map((company) => this.toEntity(company));
  }

  async save(company: CompanyEntity): Promise<void> {
    await this.companyModel.findOneAndUpdate(
      { id: company.id },
      {
        id: company.id,
        name: company.name.value,
        siret: company.siret.value,
        phone: company.phone,
        address: company.address,
        city: company.city,
        postalCode: company.postalCode,
        country: company.country,
        createdAt: company.createdAt,
        updatedAt: company.updatedAt,
        // Gérer les drivers indépendamment
        //drivers: [],
      },
      { upsert: true, new: true }
    );
  }

  async delete(id: string): Promise<void> {
    const result = await this.companyModel.deleteOne({ id });
    if (result.deletedCount === 0) {
      throw new Error("Company not found");
    }
  }
}
