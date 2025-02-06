import { AddDriverLicense } from "../../../../../application/usecases/driverLicense/AddDriverLicense";
import { MongoDriverLicenseRepository } from "../../../../mongoose/repositories/MongoDriverLicenseRepository";
import { MongoDriverRepository } from "../../../../mongoose/repositories/MongoDriverRepository";
import { MongoCompanyRepository } from "../../../../mongoose/repositories/MongoCompanyRepository";
import { DatabaseConnector } from "../../../../config/DatabaseConfig";
import { CompanyEntity } from "../../../../../domain/entities/CompanyEntity";
import { DriverEntity } from "../../../../../domain/entities/DriverEntity";
import { CompanyName } from "../../../../../domain/types/CompanyName";
import { CompanySiret } from "../../../../../domain/types/CompanySiret";
import { DriverNotFound } from "../../../../../domain/errors/DriverNotFound";
import { InvalidLicenseDate } from "../../../../../domain/errors/InvalidLicenseDate";
import { InvalidLicenseCategory } from "../../../../../domain/errors/InvalidLicenseCategory";

describe("AddDriverLicense Integration", () => {
  let addDriverLicense: AddDriverLicense;
  let driverLicenseRepository: MongoDriverLicenseRepository;
  let driverRepository: MongoDriverRepository;
  let companyRepository: MongoCompanyRepository;
  let databaseConnector: DatabaseConnector;
  let testCompany: CompanyEntity;
  let testDriver: DriverEntity;

  beforeAll(async () => {
    databaseConnector = DatabaseConnector.getInstance();
    await databaseConnector.initialize();
    driverLicenseRepository = new MongoDriverLicenseRepository(
      databaseConnector.getMongoConnection()
    );
    driverRepository = new MongoDriverRepository(
      databaseConnector.getMongoConnection()
    );
    companyRepository = new MongoCompanyRepository(
      databaseConnector.getMongoConnection()
    );
    addDriverLicense = new AddDriverLicense(
      driverLicenseRepository,
      driverRepository
    );
  });

  afterAll(async () => {
    await databaseConnector.closeConnections();
  });

  beforeEach(async () => {
    await companyRepository["companyModel"].deleteMany({});

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

    testDriver = DriverEntity.create(
      "John",
      "Doe",
      "0123456789",
      "john.doe@example.com",
      new Date("1990-01-01"),
      testCompany.id
    );

    await driverRepository.save(testDriver);
  });

  it("should successfully add a driver license", async () => {
    const issueDate = new Date();
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);

    const result = await addDriverLicense.execute(
      "12345",
      issueDate,
      expirationDate,
      "VALID",
      ["A1", "B"],
      testDriver.id
    );

    expect(result).toBeUndefined();

    const updatedDriver = await driverRepository.findById(testDriver.id);
    expect(updatedDriver).not.toBeNull();
    expect(updatedDriver?.driverLicenseId).not.toBeNull();
    const license = await driverLicenseRepository.findByDriver(testDriver.id);

    expect(license).not.toBeNull();
    expect(license?.licenseNumber).toBe("12345");
    expect(license?.status).toBe("VALID");
    expect(license?.categories.map((cat) => cat.value)).toEqual(
      expect.arrayContaining(["A1", "B"])
    );
  });

  it("should return error when driver doesn't exist", async () => {
    const issueDate = new Date();
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);

    const result = await addDriverLicense.execute(
      "12345",
      issueDate,
      expirationDate,
      "VALID",
      ["A1", "B"],
      "non-existent-id"
    );

    expect(result).toBeInstanceOf(DriverNotFound);
  });

  it("should return error when license dates are invalid", async () => {
    const issueDate = new Date();
    const expirationDate = new Date(issueDate.getTime() - 86400000);

    const result = await addDriverLicense.execute(
      "12345",
      issueDate,
      expirationDate,
      "VALID",
      ["A1", "B"],
      testDriver.id
    );

    expect(result).toBeInstanceOf(InvalidLicenseDate);

    const updatedDriver = await driverRepository.findById(testDriver.id);
    expect(updatedDriver?.driverLicenseId).toBeNull();
  });

  it("should return error when license categories are invalid", async () => {
    const issueDate = new Date();
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);

    const result = await addDriverLicense.execute(
      "12345",
      issueDate,
      expirationDate,
      "VALID",
      ["INVALID_CATEGORY"],
      testDriver.id
    );

    expect(result).toBeInstanceOf(InvalidLicenseCategory);

    const updatedDriver = await driverRepository.findById(testDriver.id);
    expect(updatedDriver?.driverLicenseId).toBeNull();
  });
});
