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
import { IncidentNotFoundError } from "../../../../../domain/errors/IncidentNotFoundError";
import { EditIncident } from "../../../../../application/usecases/incident/EditIncident";

describe("EditIncidentReport Integration", () => {
  let editIncidentReport: EditIncident;
  let createIncident: CreateIncidentReport;
  let incidentRepository: MongoIncidentRepository;
  let companyRepository: MongoCompanyRepository;
  let driverRepository: MongoDriverRepository;
  let motorcycleRepository: SequelizeMotorcycleRepository;
  let databaseConnector: DatabaseConnector;
  let testCompany: CompanyEntity;
  let testDriver: DriverEntity;
  let testMotorcycleId: string;
  let testIncidentId: string;

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

    editIncidentReport = new EditIncident(incidentRepository);

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

    const result = await createIncident.execute(
      testDriver.id,
      testMotorcycleId,
      new Date(),
      "Test incident details"
    );

    const incidents = await incidentRepository.findByDriver(testDriver.id);
    testIncidentId = incidents[0].id;
  });

  it("should successfully edit an incident", async () => {
    const newDate = new Date();
    const result = await editIncidentReport.execute(
      testIncidentId,
      testDriver.id,
      testMotorcycleId,
      newDate,
      "Updated incident details"
    );

    expect(result).toBeUndefined();

    const updatedIncident = await incidentRepository.findById(testIncidentId);
    expect(updatedIncident).not.toBeNull();
    expect(updatedIncident?.driverId).toBe(testDriver.id);
    expect(updatedIncident?.motorcycleId).toBe(testMotorcycleId);
    expect(updatedIncident?.incidentDate).toEqual(newDate);
    expect(updatedIncident?.incidentDetails).toBe("Updated incident details");
  });

  it("should return error when incident doesn't exist", async () => {
    const result = await editIncidentReport.execute(
      "non-existent-id",
      testDriver.id,
      testMotorcycleId,
      new Date(),
      "Updated details"
    );

    expect(result).toBeInstanceOf(IncidentNotFoundError);
  });

  it("should keep incident id after update", async () => {
    const newDate = new Date();
    await editIncidentReport.execute(
      testIncidentId,
      testDriver.id,
      testMotorcycleId,
      newDate,
      "Updated incident details"
    );

    const updatedIncident = await incidentRepository.findById(testIncidentId);
    expect(updatedIncident?.id).toBe(testIncidentId);
  });
});
