import { MongoCompanyRepository } from "../mongoose/repositories/MongoCompanyRepository";
import { MongoDriverRepository } from "../mongoose/repositories/MongoDriverRepository";
import { MongoDriverLicenseRepository } from "../mongoose/repositories/MongoDriverLicenseRepository";
import { DatabaseConnector } from "./DatabaseConfig";

export class RepositoryFactory {
  private static instance: RepositoryFactory;
  private repositories: Map<string, any>;
  private databaseConnector: DatabaseConnector;

  private constructor() {
    this.repositories = new Map();
    this.databaseConnector = DatabaseConnector.getInstance();
  }

  public static getInstance(): RepositoryFactory {
    if (!RepositoryFactory.instance) {
      RepositoryFactory.instance = new RepositoryFactory();
    }
    return RepositoryFactory.instance;
  }

  private getRepositoryType(entityName: string): "SQL" | "NOSQL" {
    const nosqlEntities = [
      "CompanyEntity",
      "DriverEntity",
      "DriverLicenseEntity",
      "IncidentEntity",
    ];
    return nosqlEntities.includes(entityName) ? "NOSQL" : "SQL";
  }

  public getRepository<T>(entityName: string): T {
    const existingRepository = this.repositories.get(entityName);
    if (existingRepository) {
      return existingRepository as T;
    }

    const repositoryType = this.getRepositoryType(entityName);
    let repository;

    switch (entityName) {
      case "CompanyEntity":
        repository = new MongoCompanyRepository(
          this.databaseConnector.getMongoConnection()
        );
        break;
      case "DriverEntity":
        repository = new MongoDriverRepository(
          this.databaseConnector.getMongoConnection()
        );
        break;
      case "DriverLicenseEntity":
        repository = new MongoDriverLicenseRepository(
          this.databaseConnector.getMongoConnection()
        );
        break;
      default:
        throw new Error("Repository not found");
    }

    this.repositories.set(entityName, repository);
    return repository as T;
  }
}
