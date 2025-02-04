import { DatabaseConnector } from "../../../../config/DatabaseConfig";
import { MongoDriverRepository } from "../../../../mongoose/repositories/MongoDriverRepository";
import { MongoCompanyRepository } from "../../../../mongoose/repositories/MongoCompanyRepository";
import { EditDriver } from "../../../../../application/usecases/driver/EditDriver";
import { CompanyEntity } from "../../../../../domain/entities/CompanyEntity";
import { CompanyName } from "../../../../../domain/types/CompanyName";
import { CompanySiret } from "../../../../../domain/types/CompanySiret";
import { DriverEntity } from "../../../../../domain/entities/DriverEntity";
import { DriverNotFound } from "../../../../../domain/errors/DriverNotFound";

describe("EditDriver Integration", () => {
  let editDriver: EditDriver;
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
    editDriver = new EditDriver(driverRepository);
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

  it("should successfully edit a driver", async () => {
    const updatedBirthDate = new Date("1991-02-02");

    const result = await editDriver.execute(
      testDriver.id,
      "John",
      "Updated",
      "9876543210",
      "john.updated@example.com",
      updatedBirthDate,
      testCompany.id
    );

    expect(result).toBeUndefined();

    const updatedDriver = await driverRepository.findById(testDriver.id);
    expect(updatedDriver).not.toBeNull();
    expect(updatedDriver?.lastName).toBe("Updated");
    expect(updatedDriver?.phone).toBe("9876543210");
    expect(updatedDriver?.email).toBe("john.updated@example.com");
    expect(updatedDriver?.birthDate).toEqual(updatedBirthDate);
  });

  it("should return DriverNotFound when driver doesn't exist", async () => {
    const result = await editDriver.execute(
      "non-existent-id",
      "John",
      "Doe",
      "0123456789",
      "john.doe@example.com",
      new Date(),
      testCompany.id,
      "license123"
    );

    expect(result).toBeInstanceOf(DriverNotFound);
  });
});
