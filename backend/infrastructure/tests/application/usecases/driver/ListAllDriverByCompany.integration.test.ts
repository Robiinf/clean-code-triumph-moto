import { ListAllDriverByCompany } from "../../../../../application/usecases/driver/ListAllDriverByCompany";
import { MongoDriverRepository } from "../../../../mongoose/repositories/MongoDriverRepository";
import { MongoCompanyRepository } from "../../../../mongoose/repositories/MongoCompanyRepository";
import { DatabaseConnector } from "../../../../config/DatabaseConfig";
import { CompanyEntity } from "../../../../../domain/entities/CompanyEntity";
import { DriverEntity } from "../../../../../domain/entities/DriverEntity";
import { CompanyName } from "../../../../../domain/types/CompanyName";
import { CompanySiret } from "../../../../../domain/types/CompanySiret";

describe("ListAllDriverByCompany Integration", () => {
  let listAllDriverByCompany: ListAllDriverByCompany;
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
    listAllDriverByCompany = new ListAllDriverByCompany(driverRepository);
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

  it("should return all drivers for a company", async () => {
    const driver1 = DriverEntity.create(
      "John",
      "Doe",
      "0123456789",
      "john@example.com",
      new Date("1990-01-01"),
      testCompany.id
    );

    const driver2 = DriverEntity.create(
      "Jane",
      "Smith",
      "9876543210",
      "jane@example.com",
      new Date("1992-02-02"),
      testCompany.id
    );

    await driverRepository.save(driver1);
    await driverRepository.save(driver2);

    const drivers = await listAllDriverByCompany.execute(testCompany.id);

    expect(drivers).toHaveLength(2);
    expect(drivers.map((d) => d.firstName)).toContain("John");
    expect(drivers.map((d) => d.firstName)).toContain("Jane");
  });

  it("should return empty array for company with no drivers", async () => {
    const drivers = await listAllDriverByCompany.execute(testCompany.id);
    expect(drivers).toHaveLength(0);
  });

  it("should return empty array for non-existent company", async () => {
    const drivers = await listAllDriverByCompany.execute("non-existent-id");
    expect(drivers).toHaveLength(0);
  });
});
