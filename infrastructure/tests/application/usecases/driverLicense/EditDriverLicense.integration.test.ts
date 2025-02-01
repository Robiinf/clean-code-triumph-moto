import { DatabaseConnector } from "../../../../config/DatabaseConfig";
import { MongoDriverRepository } from "../../../../mongoose/repositories/MongoDriverRepository";
import { MongoDriverLicenseRepository } from "../../../../mongoose/repositories/MongoDriverLicenseRepository";
import { MongoCompanyRepository } from "../../../../mongoose/repositories/MongoCompanyRepository";
import { EditDriverLicense } from "../../../../../application/usecases/driverLicense/EditDriverLicense";
import { AddDriverLicense } from "../../../../../application/usecases/driverLicense/AddDriverLicense";
import { CompanyEntity } from "../../../../../domain/entities/CompanyEntity";
import { DriverEntity } from "../../../../../domain/entities/DriverEntity";
import { CompanyName } from "../../../../../domain/types/CompanyName";
import { CompanySiret } from "../../../../../domain/types/CompanySiret";
import { DriverLicenseNotFoundError } from "../../../../../domain/errors/DriverLicenseNotFoundError";
import { InvalidLicenseDate } from "../../../../../domain/errors/InvalidLicenseDate";
import { InvalidLicenseCategory } from "../../../../../domain/errors/InvalidLicenseCategory";

describe("EditDriverLicense Integration", () => {
  let editDriverLicense: EditDriverLicense;
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
    editDriverLicense = new EditDriverLicense(
      driverLicenseRepository,
      driverRepository
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

    // Créer une licence pour le driver
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

    // Récupérer l'ID de la licence créée
    const driver = await driverRepository.findById(testDriver.id);
    testLicenseId = driver!.driverLicenseId!;
  });

  it("should successfully update a driver license", async () => {
    const newIssueDate = new Date();
    const newExpirationDate = new Date();
    newExpirationDate.setFullYear(newExpirationDate.getFullYear() + 2);

    const result = await editDriverLicense.execute(
      testLicenseId,
      "54321", // Nouveau numéro
      newIssueDate,
      newExpirationDate,
      "RENEWED",
      ["A1", "B", "C"] // Nouvelles catégories
    );

    expect(result).toBeUndefined();

    // Vérifier que la licence a été mise à jour
    const updatedLicense = await driverLicenseRepository.findById(
      testLicenseId
    );
    expect(updatedLicense).not.toBeNull();
    expect(updatedLicense?.licenseNumber).toBe("54321");
    expect(updatedLicense?.status).toBe("RENEWED");
    expect(updatedLicense?.categories.map((cat) => cat.value)).toEqual(
      expect.arrayContaining(["A1", "B", "C"])
    );
  });

  it("should return error when license doesn't exist", async () => {
    const result = await editDriverLicense.execute(
      "non-existent-id",
      "12345",
      new Date(),
      new Date(Date.now() + 31536000000),
      "VALID",
      ["A1", "B"]
    );

    expect(result).toBeInstanceOf(DriverLicenseNotFoundError);
  });

  it("should return error when license dates are invalid", async () => {
    const issueDate = new Date();
    const expirationDate = new Date(issueDate.getTime() - 86400000); // Un jour avant

    const result = await editDriverLicense.execute(
      testLicenseId,
      "12345",
      issueDate,
      expirationDate,
      "VALID",
      ["A1", "B"]
    );

    expect(result).toBeInstanceOf(InvalidLicenseDate);

    // Vérifier que la licence n'a pas été modifiée
    const license = await driverLicenseRepository.findById(testLicenseId);
    expect(license?.licenseNumber).toBe("12345");
  });

  it("should return error when license categories are invalid", async () => {
    const result = await editDriverLicense.execute(
      testLicenseId,
      "12345",
      new Date(),
      new Date(Date.now() + 31536000000),
      "VALID",
      ["INVALID_CATEGORY"]
    );

    expect(result).toBeInstanceOf(InvalidLicenseCategory);

    // Vérifier que la licence n'a pas été modifiée
    const license = await driverLicenseRepository.findById(testLicenseId);
    expect(license?.categories.map((cat) => cat.value)).toEqual(
      expect.arrayContaining(["A1", "B"])
    );
  });
});
