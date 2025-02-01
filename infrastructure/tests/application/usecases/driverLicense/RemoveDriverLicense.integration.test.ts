import { RemoveDriverLicense } from "../../../../../application/usecases/driverLicense/RemoveDriverLicense";
import { AddDriverLicense } from "../../../../../application/usecases/driverLicense/AddDriverLicense";
import { MongoDriverLicenseRepository } from "../../../../mongoose/repositories/MongoDriverLicenseRepository";
import { MongoDriverRepository } from "../../../../mongoose/repositories/MongoDriverRepository";
import { MongoCompanyRepository } from "../../../../mongoose/repositories/MongoCompanyRepository";
import { DatabaseConnector } from "../../../../config/DatabaseConfig";
import { CompanyEntity } from "../../../../../domain/entities/CompanyEntity";
import { DriverEntity } from "../../../../../domain/entities/DriverEntity";
import { CompanyName } from "../../../../../domain/types/CompanyName";
import { CompanySiret } from "../../../../../domain/types/CompanySiret";
import { DriverLicenseNotFoundError } from "../../../../../domain/errors/DriverLicenseNotFoundError";

describe("RemoveDriverLicense Integration", () => {
  let removeDriverLicense: RemoveDriverLicense;
  let addDriverLicense: AddDriverLicense;
  let driverLicenseRepository: MongoDriverLicenseRepository;
  let driverRepository: MongoDriverRepository;
  let companyRepository: MongoCompanyRepository;
  let databaseConnector: DatabaseConnector;
  let testCompany: CompanyEntity;
  let testDriver: DriverEntity;
  let testLicenseId: string;

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
    removeDriverLicense = new RemoveDriverLicense(
      driverLicenseRepository,
      driverRepository
    );
  });

  afterAll(async () => {
    await databaseConnector.closeConnections();
  });

  beforeEach(async () => {
    await companyRepository["companyModel"].deleteMany({});

    // Créer une company de test
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

    // Créer un driver de test
    testDriver = DriverEntity.create(
      "John",
      "Doe",
      "0123456789",
      "john.doe@example.com",
      new Date("1990-01-01"),
      testCompany.id
    );

    await driverRepository.save(testDriver);

    // Créer une licence
    const issueDate = new Date();
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);

    await addDriverLicense.execute(
      "12345",
      issueDate,
      expirationDate,
      "VALID",
      ["A1", "B"],
      testDriver.id
    );

    const driver = await driverRepository.findById(testDriver.id);
    testLicenseId = driver!.driverLicenseId!;
  });

  it("should successfully remove a driver license", async () => {
    const result = await removeDriverLicense.execute(testLicenseId);

    expect(result).toBeUndefined();

    // Vérifier que la licence a été supprimée
    const license = await driverLicenseRepository.findById(testLicenseId);
    expect(license).toBeNull();

    // Vérifier que le driverLicenseId a été retiré du driver
    const updatedDriver = await driverRepository.findById(testDriver.id);
    expect(updatedDriver?.driverLicenseId).toBeNull();
  });

  it("should return error when license doesn't exist", async () => {
    const result = await removeDriverLicense.execute("non-existent-id");
    expect(result).toBeInstanceOf(DriverLicenseNotFoundError);
  });
});
