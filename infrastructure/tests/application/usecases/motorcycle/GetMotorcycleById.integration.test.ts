import { DatabaseConnector } from "../../../../config/DatabaseConfig";
import { SequelizeMotorcycleRepository } from "../../../../sequelize/repositories/SequelizeMotorcycleRepository";
import { GetMotorcycleById } from "../../../../../application/usecases/motorcycle/GetMotorcycleById";
import { AddMotorcycle } from "../../../../../application/usecases/motorcycle/AddMotorcycle";
import { MotorcycleModel } from "../../../../sequelize/models/MotorcycleModel";
import { VehicleNotFound } from "../../../../../domain/errors/VehicleNotFound";

describe("GetMotorcycleById Integration", () => {
  let getMotorcycleById: GetMotorcycleById;
  let addMotorcycle: AddMotorcycle;
  let motorcycleRepository: SequelizeMotorcycleRepository;
  let databaseConnector: DatabaseConnector;
  let testMotorcycleId: string;

  beforeAll(async () => {
    databaseConnector = DatabaseConnector.getInstance();
    await databaseConnector.initialize();

    const sequelize = databaseConnector.getSequelizeConnection();
    motorcycleRepository = new SequelizeMotorcycleRepository(sequelize);

    await MotorcycleModel.sync({ force: true });

    getMotorcycleById = new GetMotorcycleById(motorcycleRepository);
    addMotorcycle = new AddMotorcycle(motorcycleRepository);
  });

  afterAll(async () => {
    await databaseConnector.closeConnections();
  });

  beforeEach(async () => {
    await MotorcycleModel.destroy({ where: {} });

    await addMotorcycle.execute(
      "1HGCM82633A123456",
      "Triumph Street Triple",
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

  it("should successfully get a motorcycle by id", async () => {
    const result = await getMotorcycleById.execute(testMotorcycleId);
    if (result instanceof VehicleNotFound) {
      throw new Error("Vehicle not found");
    }

    expect(result).not.toBeInstanceOf(Error);
    expect(result?.id).toBe(testMotorcycleId);
    expect(result?.model).toBe("Triumph Street Triple");
    expect(result?.vin.value).toBe("1HGCM82633A123456");
  });

  it("should return MotorcycleNotFound when motorcycle doesn't exist", async () => {
    const result = await getMotorcycleById.execute("non-existent-id");
    expect(result).toBeInstanceOf(VehicleNotFound);
  });
});
