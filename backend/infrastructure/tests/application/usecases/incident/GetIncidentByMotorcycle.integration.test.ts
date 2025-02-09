import { ListIncidentsByMotorcycle } from "../../../../../application/usecases/incident/ListIncidentsByMotorcycle";
import { CreateIncidentReport } from "../../../../../application/usecases/incident/CreateIncidentReport";
import { MongoIncidentRepository } from "../../../../mongoose/repositories/MongoIncidentRepository";
import { MongoCompanyRepository } from "../../../../mongoose/repositories/MongoCompanyRepository";
import { MongoDriverRepository } from "../../../../mongoose/repositories/MongoDriverRepository";
import { SequelizeMotorcycleRepository } from "../../../../sequelize/repositories/SequelizeMotorcycleRepository";
import { DatabaseConnector } from "../../../../config/DatabaseConfig";
import { CompanyEntity } from "../../../../../domain/entities/CompanyEntity";
import { DriverEntity } from "../../../../../domain/entities/DriverEntity";
import { MotorcycleModel } from "../../../../sequelize/models/MotorcycleModel";
import { CompanyName } from "../../../../../domain/types/CompanyName";
import { CompanySiret } from "../../../../../domain/types/CompanySiret";
import { AddMotorcycle } from "../../../../../application/usecases/motorcycle/AddMotorcycle";

describe("ListIncidentByMotorcycle Integration", () => {
  let listIncidentByMotorcycle: ListIncidentsByMotorcycle;
  let createIncident: CreateIncidentReport;
  let incidentRepository: MongoIncidentRepository;
  let companyRepository: MongoCompanyRepository;
  let driverRepository: MongoDriverRepository;
  let motorcycleRepository: SequelizeMotorcycleRepository;
  let databaseConnector: DatabaseConnector;
  let testCompany: CompanyEntity;
  let testDriver: DriverEntity;
  let testDriver2: DriverEntity;
  let testMotorcycleId: string;
  let testMotorcycleId2: string;

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

    listIncidentByMotorcycle = new ListIncidentsByMotorcycle(
      incidentRepository
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

    testDriver2 = DriverEntity.create(
      "Jane",
      "Doe",
      "0123456789",
      "jane@test.com",
      new Date("1990-01-01"),
      testCompany.id
    );

    await driverRepository.save(testDriver);
    await driverRepository.save(testDriver2);

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

    await addMotorcycle.execute(
      "1HGCM82633A123457",
      "Test Motorcycle 2",
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
    testMotorcycleId2 = motorcycles[1].id;

    await createIncident.execute(
      testDriver.id,
      testMotorcycleId,
      new Date(),
      "Test incident details"
    );

    await createIncident.execute(
      testDriver2.id,
      testMotorcycleId2,
      new Date(),
      "Test incident details 2"
    );
  });

  it("should successfully list incidents by Motorcycle 1", async () => {
    const incidents = await listIncidentByMotorcycle.execute(testMotorcycleId);
    expect(incidents).toHaveLength(1);
    expect(incidents[0].incidentDetails).toBe("Test incident details");
  });

  it("should successfully list incidents by motorcycle 2", async () => {
    const incidents2 = await listIncidentByMotorcycle.execute(
      testMotorcycleId2
    );
    expect(incidents2).toHaveLength(1);
    expect(incidents2[0].incidentDetails).toBe("Test incident details 2");
  });

  it("should return empty array when motorcycle has no incidents", async () => {
    const incidents = await listIncidentByMotorcycle.execute("non-existent-id");
    expect(incidents).toHaveLength(0);
  });
});
