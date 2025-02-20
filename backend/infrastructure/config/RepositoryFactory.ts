import { MongoCompanyRepository } from "../mongoose/repositories/MongoCompanyRepository";
import { MongoDriverRepository } from "../mongoose/repositories/MongoDriverRepository";
import { MongoDriverLicenseRepository } from "../mongoose/repositories/MongoDriverLicenseRepository";
import { DatabaseConnector } from "./DatabaseConfig";
import { SequelizeMotorcycleRepository } from "../sequelize/repositories/SequelizeMotorcycleRepository";
import { MongoIncidentRepository } from "../mongoose/repositories/MongoIncidentRepository";
import { SequelizeTestDriveRepository } from "../sequelize/repositories/SequelizeTestDriveRepository";
import { SequelizeBreakdownRepository } from "../sequelize/repositories/SequelizeBreakdownRepository";
import { SequelizeWarrantyRepository } from "../sequelize/repositories/SequelizeWarrantyRepository";
import { SequelizeOrderRepository } from "../sequelize/repositories/SequelizeOrderRepository";
import { SequelizeOrderLineRepository } from "../sequelize/repositories/SequelizeOrderLineRepository";
import { SequelizeRentalRepository } from "../sequelize/repositories/SequelizeRentalRepository";
import { SequelizeSparePartRepository } from "../sequelize/repositories/SequelizeSparePartRepository";
import { SequelizeMaintenanceRecursionRepository } from "../sequelize/repositories/SequelizeMaintenanceRecursionRepository";
import { SequelizeMaintenanceRepository } from "../sequelize/repositories/SequelizeMaintenanceRepository";

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
      case "IncidentEntity":
        repository = new MongoIncidentRepository(
          this.databaseConnector.getMongoConnection()
        );
        break;
      case "MotorcycleEntity":
        repository = new SequelizeMotorcycleRepository(
          this.databaseConnector.getSequelizeConnection()
        );
        break;
      case "TestDriveEntity":
        repository = new SequelizeTestDriveRepository(
          this.databaseConnector.getSequelizeConnection()
        );
        break;
      case "BreakdownEntity":
        repository = new SequelizeBreakdownRepository(
          this.databaseConnector.getSequelizeConnection()
        );
        break;
      case "WarrantyEntity":
        repository = new SequelizeWarrantyRepository(
          this.databaseConnector.getSequelizeConnection()
        );
        break;
      case "RentalEntity":
        repository = new SequelizeRentalRepository(
          this.databaseConnector.getSequelizeConnection()
        );
        break;
      case "SparePartEntity":
        repository = new SequelizeSparePartRepository(
          this.databaseConnector.getSequelizeConnection()
        );
        break;
      case "OrderEntity":
        repository = new SequelizeOrderRepository(
          this.databaseConnector.getSequelizeConnection()
        );
        break;
      case "OrderLineEntity":
        repository = new SequelizeOrderLineRepository(
          this.databaseConnector.getSequelizeConnection()
        );
        break;
      case "MaintenanceRecursionEntity":
        repository = new SequelizeMaintenanceRecursionRepository(
          this.databaseConnector.getSequelizeConnection()
        );
        break;
      case "MaintenanceEntity":
        repository = new SequelizeMaintenanceRepository(
          this.databaseConnector.getSequelizeConnection()
        );
        break;
      default:
        throw new Error("Repository not found : " + entityName);
    }

    this.repositories.set(entityName, repository);
    return repository as T;
  }
}
