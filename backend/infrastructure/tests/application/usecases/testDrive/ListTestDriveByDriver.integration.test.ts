import { DatabaseConnector } from "../../../../config/DatabaseConfig";
import { SequelizeMotorcycleRepository } from "../../../../sequelize/repositories/SequelizeMotorcycleRepository";
import { MongoCompanyRepository } from "../../../../mongoose/repositories/MongoCompanyRepository";
import { MongoDriverRepository } from "../../../../mongoose/repositories/MongoDriverRepository";
import { SequelizeTestDriveRepository } from "../../../../sequelize/repositories/SequelizeTestDriveRepository";
import { MotorcycleModel } from "../../../../sequelize/models/MotorcycleModel";
import { TestDriveModel } from "../../../../sequelize/models/TestDriveModel";
import { CompanyName } from "../../../../../domain/types/CompanyName";
import { CompanySiret } from "../../../../../domain/types/CompanySiret";
import { CompanyEntity } from "../../../../../domain/entities/CompanyEntity";
import { DriverEntity } from "../../../../../domain/entities/DriverEntity";
import { AddMotorcycle } from "../../../../../application/usecases/motorcycle/AddMotorcycle";
import { CreateTestDrive } from "../../../../../application/usecases/testDrive/CreateTestDrive";
import { AddDriverLicense } from "../../../../../application/usecases/driverLicense/AddDriverLicense";
import { MongoDriverLicenseRepository } from "../../../../mongoose/repositories/MongoDriverLicenseRepository";
import { ListTestDriveByDriver } from "../../../../../application/usecases/testDrive/ListTestDriveByDriver";

describe("ListTestDriveByDriver Integration", () => {
  let databaseConnector: DatabaseConnector;
  let companyRepository: MongoCompanyRepository;
  let driverRepository: MongoDriverRepository;
  let addDriverLicense: AddDriverLicense;
  let listTestDriveByDriver: ListTestDriveByDriver;
  let motorcycleRepository: SequelizeMotorcycleRepository;
  let testDriveRepository: SequelizeTestDriveRepository;
  let driverLicenseRepository: MongoDriverLicenseRepository;
  let testCompany: CompanyEntity;
  let testDriver: DriverEntity;
  let testMotorcycleId: string;

  beforeAll(async () => {
    databaseConnector = DatabaseConnector.getInstance();
    await databaseConnector.initialize();

    companyRepository = new MongoCompanyRepository(
      databaseConnector.getMongoConnection()
    );
    driverRepository = new MongoDriverRepository(
      databaseConnector.getMongoConnection()
    );
    motorcycleRepository = new SequelizeMotorcycleRepository(
      databaseConnector.getSequelizeConnection()
    );
    testDriveRepository = new SequelizeTestDriveRepository(
      databaseConnector.getSequelizeConnection()
    );
    driverLicenseRepository = new MongoDriverLicenseRepository(
      databaseConnector.getMongoConnection()
    );

    addDriverLicense = new AddDriverLicense(
      driverLicenseRepository,
      driverRepository
    );

    listTestDriveByDriver = new ListTestDriveByDriver(testDriveRepository);

    await MotorcycleModel.sync({ force: true });
    await TestDriveModel.sync({ force: true });
  });

  afterAll(async () => {
    await databaseConnector.closeConnections();
  });

  beforeEach(async () => {
    await companyRepository["companyModel"].deleteMany({});
    await TestDriveModel.destroy({ where: {} });
    await MotorcycleModel.destroy({ where: {} });

    const companyName = CompanyName.from("Test Company");
    const companySiret = CompanySiret.from("73282932000074");

    if (companyName instanceof Error || companySiret instanceof Error) {
      throw new Error("Failed to create test data");
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
      "john@test.com",
      new Date("1990-01-01"),
      testCompany.id
    );

    await driverRepository.save(testDriver);

    const addMotorcycle = new AddMotorcycle(motorcycleRepository);
    await addMotorcycle.execute(
      "1HGCM82633A123456",
      "Test Motorcycle",
      2023,
      "Available",
      5000,
      "Naked",
      95,
      "Diesel",
      "Manual",
      15
    );

    const motorcycles = await motorcycleRepository.findAll();
    testMotorcycleId = motorcycles[0].id;

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

    const testDriveDate = new Date();
    const createTestDrive = new CreateTestDrive(
      testDriveRepository,
      motorcycleRepository,
      driverRepository
    );

    await createTestDrive.execute(
      testDriver.id,
      testMotorcycleId,
      testDriveDate,
      "Test session details"
    );
  });

  it("should return test drives by driver id", async () => {
    const testDrives = await listTestDriveByDriver.execute(testDriver.id);

    expect(testDrives).toHaveLength(1);
    expect(testDrives[0].driverId).toBe(testDriver.id);
    expect(testDrives[0].motorcycleId).toBe(testMotorcycleId);
  });

  it("should return empty array if no test drives found", async () => {
    const testDrives = await listTestDriveByDriver.execute(
      "non-existing-driver-id"
    );

    expect(testDrives).toHaveLength(0);
  });
});
