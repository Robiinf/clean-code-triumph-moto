import { DatabaseConnector } from "../../../../config/DatabaseConfig";
import { SequelizeMotorcycleRepository } from "../../../../sequelize/repositories/SequelizeMotorcycleRepository";
import { MotorcycleModel } from "../../../../sequelize/models/MotorcycleModel";
import { BreakdownModel } from "../../../../sequelize/models/BreakdownModel";
import { AddMotorcycle } from "../../../../../application/usecases/motorcycle/AddMotorcycle";
import { SequelizeBreakdownRepository } from "../../../../sequelize/repositories/SequelizeBreakdownRepository";
import { CreateBreakdownReport } from "../../../../../application/usecases/breakdown/CreateBreakdownReport";
import { VehicleNotFound } from "../../../../../domain/errors/VehicleNotFound";
import { BreakdownFutureDateNotAllowed } from "../../../../../domain/errors/BreakdownFutureDateNotAllowed";
import { InvalidBreakdownType } from "../../../../../domain/errors/InvalidBreakdownType";

describe("CreateBreakdownReport Integration", () => {
  let databaseConnector: DatabaseConnector;
  let motorcycleRepository: SequelizeMotorcycleRepository;
  let breakdownRepository: SequelizeBreakdownRepository;
  let createBreakdownReport: CreateBreakdownReport;
  let testMotorcycleId: string;

  beforeAll(async () => {
    databaseConnector = DatabaseConnector.getInstance();
    await databaseConnector.initialize();

    motorcycleRepository = new SequelizeMotorcycleRepository(
      databaseConnector.getSequelizeConnection()
    );

    breakdownRepository = new SequelizeBreakdownRepository(
      databaseConnector.getSequelizeConnection()
    );

    createBreakdownReport = new CreateBreakdownReport(
      breakdownRepository,
      motorcycleRepository
    );

    await MotorcycleModel.sync({ force: true });
    await BreakdownModel.sync({ force: true });
  });

  afterAll(async () => {
    await databaseConnector.closeConnections();
  });

  beforeEach(async () => {
    await BreakdownModel.destroy({ where: {} });
    await MotorcycleModel.destroy({ where: {} });

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

  it("should successfully create a breakdown report", async () => {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const result = await createBreakdownReport.execute(
      oneYearAgo,
      "Engine",
      "Engine failure",
      testMotorcycleId
    );

    expect(result).toBeUndefined();

    const breakdowns = await breakdownRepository.findByVehicleId(
      testMotorcycleId
    );
    expect(breakdowns).toHaveLength(1);
    expect(breakdowns[0].breakdownType.value).toBe("Engine");
    expect(breakdowns[0].breakdownDescription).toBe("Engine failure");
  });

  it("should return an error if the vehicle does not exist", async () => {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const result = await createBreakdownReport.execute(
      oneYearAgo,
      "Engine",
      "Engine failure",
      "invalid-id"
    );

    expect(result).toBeInstanceOf(VehicleNotFound);
  });

  it("should return an error if the breakdown date is in the future", async () => {
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

    const result = await createBreakdownReport.execute(
      oneYearFromNow,
      "Engine",
      "Engine failure",
      testMotorcycleId
    );

    expect(result).toBeInstanceOf(BreakdownFutureDateNotAllowed);
  });

  it("should return an error if the breakdown type is not allowed", async () => {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const result = await createBreakdownReport.execute(
      oneYearAgo,
      "Invalid",
      "Engine failure",
      testMotorcycleId
    );

    expect(result).toBeInstanceOf(InvalidBreakdownType);
  });
});
