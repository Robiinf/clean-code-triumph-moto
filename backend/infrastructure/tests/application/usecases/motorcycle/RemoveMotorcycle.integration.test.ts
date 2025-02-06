import { RemoveMotorcycle } from "../../../../../application/usecases/motorcycle/RemoveMotorcycle";
import { AddMotorcycle } from "../../../../../application/usecases/motorcycle/AddMotorcycle";
import { SequelizeMotorcycleRepository } from "../../../../sequelize/repositories/SequelizeMotorcycleRepository";
import { DatabaseConnector } from "../../../../config/DatabaseConfig";
import { MotorcycleModel } from "../../../../sequelize/models/MotorcycleModel";
import { VehicleNotFound } from "../../../../../domain/errors/VehicleNotFound";

describe("RemoveMotorcycle Integration", () => {
  let removeMotorcycle: RemoveMotorcycle;
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

    removeMotorcycle = new RemoveMotorcycle(motorcycleRepository);
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

  it("should successfully remove a motorcycle", async () => {
    const result = await removeMotorcycle.execute(testMotorcycleId);

    expect(result).toBeUndefined();

    const motorcycles = await motorcycleRepository.findAll();
    expect(motorcycles).toHaveLength(0);
  });
});
