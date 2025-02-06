import { DatabaseConnector } from "../../../../config/DatabaseConfig";
import { MongoIncidentRepository } from "../../../../mongoose/repositories/MongoIncidentRepository";
import { MongoCompanyRepository } from "../../../../mongoose/repositories/MongoCompanyRepository";
import { MongoDriverRepository } from "../../../../mongoose/repositories/MongoDriverRepository";
import { SequelizeMotorcycleRepository } from "../../../../sequelize/repositories/SequelizeMotorcycleRepository";
import { CreateIncidentReport } from "../../../../../application/usecases/incident/CreateIncidentReport";
import { AddMotorcycle } from "../../../../../application/usecases/motorcycle/AddMotorcycle";
import { CompanyName } from "../../../../../domain/types/CompanyName";
import { CompanySiret } from "../../../../../domain/types/CompanySiret";
import { CompanyEntity } from "../../../../../domain/entities/CompanyEntity";
import { DriverEntity } from "../../../../../domain/entities/DriverEntity";
import { MotorcycleModel } from "../../../../sequelize/models/MotorcycleModel";
import { DriverNotFound } from "../../../../../domain/errors/DriverNotFound";
import { VehicleNotFound } from "../../../../../domain/errors/VehicleNotFound";

describe("CreateIncidentReport Integration", () => {
  let createIncident: CreateIncidentReport;
  let incidentRepository: MongoIncidentRepository;
  let companyRepository: MongoCompanyRepository;
  let driverRepository: MongoDriverRepository;
  let motorcycleRepository: SequelizeMotorcycleRepository;
  let databaseConnector: DatabaseConnector;
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
    incidentRepository = new MongoIncidentRepository(
      databaseConnector.getMongoConnection()
    );
    motorcycleRepository = new SequelizeMotorcycleRepository(
      databaseConnector.getSequelizeConnection()
    );

    createIncident = new CreateIncidentReport(
      incidentRepository,
      driverRepository,
      motorcycleRepository
    );

    await MotorcycleModel.sync({ force: true });
  });

  afterAll(async () => {
    await databaseConnector.closeConnections();
  });

  beforeEach(async () => {
    await companyRepository["companyModel"].deleteMany({});
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
  });

  it("should successfully create an incident report", async () => {
    const incidentDate = new Date();
    const result = await createIncident.execute(
      testDriver.id,
      testMotorcycleId,
      incidentDate,
      "Incident test details"
    );

    expect(result).toBeUndefined();

    const incidents = await incidentRepository.findByDriver(testDriver.id);
    expect(incidents).toHaveLength(1);
    expect(incidents[0].driverId).toBe(testDriver.id);
    expect(incidents[0].motorcycleId).toBe(testMotorcycleId);
    expect(incidents[0].incidentDate).toEqual(incidentDate);
    expect(incidents[0].incidentDetails).toBe("Incident test details");
  });

  it("should create multiple incidents for the same driver", async () => {
    await createIncident.execute(
      testDriver.id,
      testMotorcycleId,
      new Date(),
      "First incident"
    );

    await createIncident.execute(
      testDriver.id,
      testMotorcycleId,
      new Date(),
      "Second incident"
    );

    const incidents = await incidentRepository.findByDriver(testDriver.id);
    expect(incidents).toHaveLength(2);
    expect(incidents[0].incidentDetails).toBe("First incident");
    expect(incidents[1].incidentDetails).toBe("Second incident");
  });

  it("should return error when driver doesn't exist", async () => {
    const result = await createIncident.execute(
      "non-existent-driver",
      testMotorcycleId,
      new Date(),
      "Test details"
    );

    expect(result).toBeInstanceOf(DriverNotFound);

    const incidents = await incidentRepository.findByMotorcycle(
      testMotorcycleId
    );
    expect(incidents).toHaveLength(0);
  });

  it("should return error when motorcycle doesn't exist", async () => {
    const result = await createIncident.execute(
      testDriver.id,
      "non-existent-motorcycle",
      new Date(),
      "Test details"
    );

    expect(result).toBeInstanceOf(VehicleNotFound);

    const incidents = await incidentRepository.findByDriver(testDriver.id);
    expect(incidents).toHaveLength(0);
  });
});
