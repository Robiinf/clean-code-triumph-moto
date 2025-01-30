import { DatabaseConnector } from "../../../../config/DatabaseConfig";
import { MongoCompanyRepository } from "../../../../mongoose/repositories/MongoCompanyRepository";
import { DeleteCompany } from "../../../../../application/usecases/company/DeleteCompany";
import { CompanyEntity } from "../../../../../domain/entities/CompanyEntity";
import { CompanyName } from "../../../../../domain/types/CompanyName";
import { CompanySiret } from "../../../../../domain/types/CompanySiret";

describe("DeleteCompany Integration", () => {
  let deleteCompany: DeleteCompany;
  let databaseConnector: DatabaseConnector;
  let repository: MongoCompanyRepository;

  beforeAll(async () => {
    databaseConnector = DatabaseConnector.getInstance();
    await databaseConnector.initialize();
    repository = new MongoCompanyRepository(
      databaseConnector.getMongoConnection()
    );
    deleteCompany = new DeleteCompany(repository);
  });

  afterAll(async () => {
    await databaseConnector.closeConnections();
  });

  beforeEach(async () => {
    await repository["companyModel"].deleteMany({});
  });

  it("should successfully delete an existing company", async () => {
    // Créer une company à supprimer

    const companyName1 = CompanyName.from("First Company");
    const companySiret1 = CompanySiret.from("44306184100047");

    if (companyName1 instanceof Error || companySiret1 instanceof Error) {
      throw new Error("Fail to create company name or siret");
    }

    const company = CompanyEntity.create(
      companyName1,
      companySiret1,
      "0123456789",
      "Test Address",
      "Test City",
      "12345",
      "Test Country"
    );

    await repository.save(company);
    const savedCompany = await repository.findById(company.id);
    expect(savedCompany).not.toBeNull();

    // Vérifier que la company existe dans la liste complète
    let companies = await repository.findAll();
    expect(companies).toHaveLength(1);
    expect(companies[0].id).toBe(company.id);

    // Supprimer la company
    await deleteCompany.execute(company.id);

    // Vérifier que la company a été supprimée
    companies = await repository.findAll();
    expect(companies).toHaveLength(0);

    // Vérifier aussi avec findById
    const deletedCompany = await repository.findById(company.id);
    expect(deletedCompany).toBeNull();
  });

  it("should throw error when trying to delete non-existent company", async () => {
    await expect(deleteCompany.execute("non-existent-id")).rejects.toThrow(
      "Company not found"
    );
  });
});
