import { DatabaseConnector } from "../../../../config/DatabaseConfig";
import { MongoCompanyRepository } from "../../../../mongoose/repositories/MongoCompanyRepository";
import { ListAllCompany } from "../../../../../application/usecases/company/ListAllCompany";
import { CompanyName } from "../../../../../domain/types/CompanyName";
import { CompanySiret } from "../../../../../domain/types/CompanySiret";
import { CompanyEntity } from "../../../../../domain/entities/CompanyEntity";

describe("ListAllCompany Integration", () => {
  let listAllCompany: ListAllCompany;
  let databaseConnector: DatabaseConnector;
  let repository: MongoCompanyRepository;

  beforeAll(async () => {
    databaseConnector = DatabaseConnector.getInstance();
    await databaseConnector.initialize();
    repository = new MongoCompanyRepository(
      databaseConnector.getMongoConnection()
    );
    listAllCompany = new ListAllCompany(repository);
  });

  afterAll(async () => {
    await databaseConnector.closeConnections();
  });

  beforeEach(async () => {
    await repository["companyModel"].deleteMany({});
  });

  it("should return empty array when no companies exist", async () => {
    const companies = await listAllCompany.execute();
    expect(companies).toEqual([]);
  });

  it("should return all existing companies", async () => {
    const companyName1 = CompanyName.from("First Company");
    const companySiret1 = CompanySiret.from("73282932000074");
    const companyName2 = CompanyName.from("Second Company");
    const companySiret2 = CompanySiret.from("44306184100047");

    if (
      companyName1 instanceof Error ||
      companySiret1 instanceof Error ||
      companyName2 instanceof Error ||
      companySiret2 instanceof Error
    ) {
      throw new Error("Fail to create company name or siret");
    }

    const company1 = CompanyEntity.create(
      companyName1,
      companySiret1,
      "0123456789",
      "Address 1",
      "City 1",
      "12345",
      "Country 1"
    );

    const company2 = CompanyEntity.create(
      companyName2,
      companySiret2,
      "9876543210",
      "Address 2",
      "City 2",
      "67890",
      "Country 2"
    );

    await repository.save(company1);
    await repository.save(company2);

    const companies = await listAllCompany.execute();

    expect(companies).toHaveLength(2);
    expect(companies.map((c) => c.name)).toContain("First Company");
    expect(companies.map((c) => c.name)).toContain("Second Company");
  });
});
