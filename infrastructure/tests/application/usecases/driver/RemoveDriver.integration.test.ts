import { DatabaseConnector } from "../../../../config/DatabaseConfig";
import { MongoDriverRepository } from "../../../../mongoose/repositories/MongoDriverRepository";
import { MongoCompanyRepository } from "../../../../mongoose/repositories/MongoCompanyRepository";
import { RemoveDriver } from "../../../../../application/usecases/driver/RemoveDriver";
import { CompanyEntity } from "../../../../../domain/entities/CompanyEntity";
import { CompanyName } from "../../../../../domain/types/CompanyName";
import { CompanySiret } from "../../../../../domain/types/CompanySiret";
import { DriverEntity } from "../../../../../domain/entities/DriverEntity";
import { DriverNotFound } from "../../../../../domain/errors/DriverNotFound";

describe("RemoveDriver Integration", () => {
  let removeDriver: RemoveDriver;
  let driverRepository: MongoDriverRepository;
  let companyRepository: MongoCompanyRepository;
  let databaseConnector: DatabaseConnector;
  let testCompany: CompanyEntity;
  let testDriver: DriverEntity;

  beforeAll(async () => {
    databaseConnector = DatabaseConnector.getInstance();
    await databaseConnector.initialize();
    driverRepository = new MongoDriverRepository(
      databaseConnector.getMongoConnection()
    );
    companyRepository = new MongoCompanyRepository(
      databaseConnector.getMongoConnection()
    );
    removeDriver = new RemoveDriver(driverRepository);
  });

  afterAll(async () => {
    await databaseConnector.closeConnections();
  });

  beforeEach(async () => {
    await driverRepository["companyModel"].deleteMany({});

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
  });

  it("should successfully remove a driver", async () => {
    const result = await removeDriver.execute(testDriver.id);

    expect(result).toBeUndefined();

    const removedDriver = await driverRepository.findById(testDriver.id);
    expect(removedDriver).toBeNull();

    const driversInCompany = await driverRepository.findByCompany(
      testCompany.id
    );
    expect(driversInCompany).toHaveLength(0);
  });

  it("should return DriverNotFound when driver doesn't exist", async () => {
    const result = await removeDriver.execute("non-existent-id");

    expect(result).toBeInstanceOf(DriverNotFound);
  });

  it("should only remove the specified driver and keep others", async () => {
    // Créer un second driver
    const secondDriver = DriverEntity.create(
      "Jane",
      "Smith",
      "9876543210",
      "jane.smith@example.com",
      new Date("1992-01-01"),
      testCompany.id
    );

    await driverRepository.save(secondDriver);

    // Vérifier que les deux drivers sont présents
    let driversInCompany = await driverRepository.findByCompany(testCompany.id);
    expect(driversInCompany).toHaveLength(2);

    // Supprimer le premier driver
    const result = await removeDriver.execute(testDriver.id);
    expect(result).toBeUndefined();

    // Vérifier que le premier driver a été supprimé
    const removedDriver = await driverRepository.findById(testDriver.id);
    expect(removedDriver).toBeNull();

    // Vérifier que le second driver existe toujours
    driversInCompany = await driverRepository.findByCompany(testCompany.id);
    expect(driversInCompany).toHaveLength(1);
    expect(driversInCompany[0].id).toBe(secondDriver.id);
    expect(driversInCompany[0].firstName).toBe("Jane");
    expect(driversInCompany[0].lastName).toBe("Smith");
  });
});
