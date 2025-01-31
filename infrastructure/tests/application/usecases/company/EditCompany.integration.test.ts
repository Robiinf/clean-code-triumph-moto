import { DatabaseConnector } from "../../../../config/DatabaseConfig";
import { MongoCompanyRepository } from "../../../../mongoose/repositories/MongoCompanyRepository";
import { EditCompany } from "../../../../../application/usecases/company/EditCompany";
import { CompanyEntity } from "../../../../../domain/entities/CompanyEntity";
import { CompanyName } from "../../../../../domain/types/CompanyName";
import { CompanySiret } from "../../../../../domain/types/CompanySiret";
import { CompanyNotFound } from "../../../../../domain/errors/CompanyNotFound";
import { CompanyNameTooShortError } from "../../../../../domain/errors/CompanyNameTooShortError";

describe("EditCompany Integration", () => {
  let editCompany: EditCompany;
  let databaseConnector: DatabaseConnector;
  let repository: MongoCompanyRepository;

  beforeAll(async () => {
    databaseConnector = DatabaseConnector.getInstance();
    await databaseConnector.initialize();
    repository = new MongoCompanyRepository(
      databaseConnector.getMongoConnection()
    );
    editCompany = new EditCompany(repository);
  });

  afterAll(async () => {
    await databaseConnector.closeConnections();
  });

  beforeEach(async () => {
    await repository["companyModel"].deleteMany({});
  });

  it("should successfully edit an existing company", async () => {
    // Créer une company à modifier
    const companyName = CompanyName.from("Test Company");
    const companySiret = CompanySiret.from("73282932000074");

    if (companyName instanceof Error || companySiret instanceof Error) {
      throw new Error("Failed to create test data");
    }

    const company = CompanyEntity.create(
      companyName,
      companySiret,
      "0123456789",
      "Initial Address",
      "Initial City",
      "12345",
      "Initial Country"
    );

    await repository.save(company);

    // Modifier la company
    const result = await editCompany.execute(
      company.id,
      "Updated Company Name",
      "44306184100047", // Un autre SIRET valide
      "9876543210",
      "Updated Address",
      "Updated City",
      "54321",
      "Updated Country"
    );

    // Vérifier qu'il n'y a pas d'erreur
    expect(result).toBeUndefined();

    // Récupérer la company mise à jour
    const updatedCompany = await repository.findById(company.id);
    expect(updatedCompany).not.toBeNull();
    expect(updatedCompany?.name).toBe("Updated Company Name");
    expect(updatedCompany?.siret).toBe("44306184100047");
    expect(updatedCompany?.phone).toBe("9876543210");
    expect(updatedCompany?.address).toBe("Updated Address");
    expect(updatedCompany?.city).toBe("Updated City");
    expect(updatedCompany?.postalCode).toBe("54321");
    expect(updatedCompany?.country).toBe("Updated Country");
    expect(updatedCompany?.updatedAt.getTime()).toBeGreaterThan(
      updatedCompany?.createdAt.getTime()
    );
  });

  it("should return CompanyNotFound when company doesn't exist", async () => {
    const result = await editCompany.execute(
      "non-existent-id",
      "Valid Name",
      "73282932000074",
      "0123456789",
      "Address",
      "City",
      "12345",
      "Country"
    );

    expect(result).toBeInstanceOf(CompanyNotFound);
  });

  it("should return error when company name is invalid", async () => {
    // Créer une company valide d'abord
    const companyName = CompanyName.from("Test Company");
    const companySiret = CompanySiret.from("73282932000074");

    if (companyName instanceof Error || companySiret instanceof Error) {
      throw new Error("Failed to create test data");
    }

    const company = CompanyEntity.create(
      companyName,
      companySiret,
      "0123456789",
      "Address",
      "City",
      "12345",
      "Country"
    );

    await repository.save(company);

    // Essayer de mettre à jour avec un nom invalide
    const result = await editCompany.execute(
      company.id,
      "Ab", // Nom trop court
      "73282932000074",
      "0123456789",
      "Address",
      "City",
      "12345",
      "Country"
    );

    expect(result).toBeInstanceOf(CompanyNameTooShortError);

    // Vérifier que la company n'a pas été modifiée
    const unchangedCompany = await repository.findById(company.id);
    expect(unchangedCompany?.name).toBe("Test Company");
  });
});
