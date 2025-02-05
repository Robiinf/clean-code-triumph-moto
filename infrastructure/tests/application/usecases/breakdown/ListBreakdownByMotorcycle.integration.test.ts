import { DatabaseConnector } from "../../../../config/DatabaseConfig";
import { SequelizeMotorcycleRepository } from "../../../../sequelize/repositories/SequelizeMotorcycleRepository";
import { MotorcycleModel } from "../../../../sequelize/models/MotorcycleModel";
import { BreakdownModel } from "../../../../sequelize/models/BreakdownModel";
import { AddMotorcycle } from "../../../../../application/usecases/motorcycle/AddMotorcycle";
import { SequelizeBreakdownRepository } from "../../../../sequelize/repositories/SequelizeBreakdownRepository";
import { CreateBreakdownReport } from "../../../../../application/usecases/breakdown/CreateBreakdownReport";
import { ListBreakdownByVehicle } from "../../../../../application/usecases/breakdown/ListBreakdownByVehicule";

describe("ListBreakdownReportByMotorcycle Integration", () => {
  let databaseConnector: DatabaseConnector;
  let motorcycleRepository: SequelizeMotorcycleRepository;
  let breakdownRepository: SequelizeBreakdownRepository;
  let createBreakdownReport: CreateBreakdownReport;
  let listBreakdownByVehicle: ListBreakdownByVehicle;
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

    listBreakdownByVehicle = new ListBreakdownByVehicle(breakdownRepository);

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

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    await createBreakdownReport.execute(
      oneYearAgo,
      "Engine",
      "Engine failure",
      testMotorcycleId
    );

    await createBreakdownReport.execute(
      oneYearAgo,
      "Brakes",
      "Brakes failure",
      testMotorcycleId
    );
  });

  it("should successfully return a list of breakdown report", async () => {
    const breakdowns = await listBreakdownByVehicle.execute(testMotorcycleId);
    expect(breakdowns).toHaveLength(2);
    expect(breakdowns[0].breakdownType.value).toBe("Engine");
    expect(breakdowns[1].breakdownType.value).toBe("Brakes");
  });

  it("should return an empty list when no breakdown report is found", async () => {
    const breakdowns = await listBreakdownByVehicle.execute("invalidId");
    expect(breakdowns).toHaveLength(0);
  });
});
