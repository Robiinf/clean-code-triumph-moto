import { CreateCompany } from "../../../../../application/usecases/company/CreateCompany";
import { DatabaseConnector } from "../../../../config/DatabaseConfig";
import { MongoCompanyRepository } from "../../../../mongoose/repositories/MongoCompanyRepository";
import { CompanyNameTooShortError } from "../../../../../domain/errors/CompanyNameTooShortError";
import { InvalidSiretError } from "../../../../../domain/errors/InvalidSiretError";

describe("CreateCompany Integration", () => {
  let createCompany: CreateCompany;
  let databaseConnector: DatabaseConnector;
  let repository: MongoCompanyRepository;

  beforeAll(async () => {
    databaseConnector = DatabaseConnector.getInstance();
    await databaseConnector.initialize();
    repository = new MongoCompanyRepository(
      databaseConnector.getMongoConnection()
    );
    createCompany = new CreateCompany(repository);
  });

  afterAll(async () => {
    await databaseConnector.closeConnections();
  });

  beforeEach(async () => {
    // Nettoyer la collection avant chaque test
    await repository["companyModel"].deleteMany({});
  });

  it("should successfully create a company with valid data", async () => {
    // Arrange
    const validCompanyData = {
      name: "Test Company",
      siret: "73282932000074",
      phone: "0123456789",
      address: "123 Test Street",
      city: "Test City",
      postalCode: "12345",
      country: "Test Country",
    };

    // Act
    await createCompany.execute(
      validCompanyData.name,
      validCompanyData.siret,
      validCompanyData.phone,
      validCompanyData.address,
      validCompanyData.city,
      validCompanyData.postalCode,
      validCompanyData.country
    );

    // Assert
    const companies = await repository.findAll();
    expect(companies).toHaveLength(1);
    expect(companies[0].name).toBe(validCompanyData.name);
    expect(companies[0].siret).toBe(validCompanyData.siret);
    expect(companies[0].phone).toBe(validCompanyData.phone);
    expect(companies[0].address).toBe(validCompanyData.address);
    expect(companies[0].city).toBe(validCompanyData.city);
    expect(companies[0].postalCode).toBe(validCompanyData.postalCode);
    expect(companies[0].country).toBe(validCompanyData.country);
  });

  it("should return error when company name is too short", async () => {
    // Arrange
    const invalidCompanyData = {
      name: "Te", // Nom trop court
      siret: "12345678901234",
      phone: "0123456789",
      address: "123 Test Street",
      city: "Test City",
      postalCode: "12345",
      country: "Test Country",
    };

    // Act
    const result = await createCompany.execute(
      invalidCompanyData.name,
      invalidCompanyData.siret,
      invalidCompanyData.phone,
      invalidCompanyData.address,
      invalidCompanyData.city,
      invalidCompanyData.postalCode,
      invalidCompanyData.country
    );

    // Assert
    expect(result).toBeInstanceOf(CompanyNameTooShortError);
    const companies = await repository.findAll();
    expect(companies).toHaveLength(0); // Vérifier qu'aucune company n'a été créée
  });

  it("should return error when SIRET is invalid", async () => {
    // Arrange
    const invalidCompanyData = {
      name: "Test Company",
      siret: "invalid-siret", // SIRET invalide
      phone: "0123456789",
      address: "123 Test Street",
      city: "Test City",
      postalCode: "12345",
      country: "Test Country",
    };

    // Act
    const result = await createCompany.execute(
      invalidCompanyData.name,
      invalidCompanyData.siret,
      invalidCompanyData.phone,
      invalidCompanyData.address,
      invalidCompanyData.city,
      invalidCompanyData.postalCode,
      invalidCompanyData.country
    );

    // Assert
    expect(result).toBeInstanceOf(InvalidSiretError);
    const companies = await repository.findAll();
    expect(companies).toHaveLength(0);
  });
});
