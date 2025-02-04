import { DatabaseConnector } from "../../../../config/DatabaseConfig";
import { MongoDriverRepository } from "../../../../mongoose/repositories/MongoDriverRepository";
import { MongoCompanyRepository } from "../../../../mongoose/repositories/MongoCompanyRepository";
import { AddDriver } from "../../../../../application/usecases/driver/AddDriver";
import { CompanyEntity } from "../../../../../domain/entities/CompanyEntity";
import { CompanyName } from "../../../../../domain/types/CompanyName";
import { CompanySiret } from "../../../../../domain/types/CompanySiret";
import { CompanyNotFound } from "../../../../../domain/errors/CompanyNotFound";

describe("AddDriver Integration", () => {
  let addDriver: AddDriver;
  let driverRepository: MongoDriverRepository;
  let companyRepository: MongoCompanyRepository;
  let databaseConnector: DatabaseConnector;
  let testCompany: CompanyEntity;

  beforeAll(async () => {
    databaseConnector = DatabaseConnector.getInstance();
    await databaseConnector.initialize();
    driverRepository = new MongoDriverRepository(
      databaseConnector.getMongoConnection()
    );
    companyRepository = new MongoCompanyRepository(
      databaseConnector.getMongoConnection()
    );
    addDriver = new AddDriver(driverRepository, companyRepository);
  });

  afterAll(async () => {
    await databaseConnector.closeConnections();
  });

  beforeEach(async () => {
    await driverRepository["companyModel"].deleteMany({});

    const companyName = CompanyName.from("Test Company");
    const companySiret = CompanySiret.from("73282932000074");

    if (companyName instanceof Error || companySiret instanceof Error) {
      throw new Error("Failed to create test company");
    }

    testCompany = CompanyEntity.create(
      companyName,
      companySiret,
      "0123456789",
      "Test Address",
      "Test City",
      "12345",
      "Test Country"
    );

    await companyRepository.save(testCompany);
  });

  it("should successfully add a driver without license", async () => {
    const result = await addDriver.execute(
      "John",
      "Doe",
      "0123456789",
      "john.doe@example.com",
      new Date("1990-01-01"),
      testCompany.id
    );

    expect(result).toBeUndefined();

    const drivers = await driverRepository.findByCompany(testCompany.id);
    expect(drivers).toHaveLength(1);
    expect(drivers[0].firstName).toBe("John");
    expect(drivers[0].driverLicenseId).toBeNull();
  });

  it("should return CompanyNotFound when company doesn't exist", async () => {
    const result = await addDriver.execute(
      "John",
      "Doe",
      "0123456789",
      "john.doe@example.com",
      new Date("1990-01-01"),
      "non-existent-company-id",
      "license123"
    );

    expect(result).toBeInstanceOf(CompanyNotFound);

    const drivers = await driverRepository.findByCompany(
      "non-existent-company-id"
    );
    expect(drivers).toHaveLength(0);
  });
});
