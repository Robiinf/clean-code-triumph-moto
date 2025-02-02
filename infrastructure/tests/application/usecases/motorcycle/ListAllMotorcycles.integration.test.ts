import { ListAllMotorcycles } from "../../../../../application/usecases/motorcycle/ListAllMotorcycles";
import { AddMotorcycle } from "../../../../../application/usecases/motorcycle/AddMotorcycle";
import { SequelizeMotorcycleRepository } from "../../../../sequelize/repositories/SequelizeMotorcycleRepository";
import { DatabaseConnector } from "../../../../config/DatabaseConfig";
import { MotorcycleModel } from "../../../../sequelize/models/MotorcycleModel";

describe("ListAllMotorcycles Integration", () => {
  let listAllMotorcycles: ListAllMotorcycles;
  let addMotorcycle: AddMotorcycle;
  let motorcycleRepository: SequelizeMotorcycleRepository;
  let databaseConnector: DatabaseConnector;

  beforeAll(async () => {
    databaseConnector = DatabaseConnector.getInstance();
    await databaseConnector.initialize();

    const sequelize = databaseConnector.getSequelizeConnection();
    motorcycleRepository = new SequelizeMotorcycleRepository(sequelize);

    await MotorcycleModel.sync({ force: true });

    listAllMotorcycles = new ListAllMotorcycles(motorcycleRepository);
    addMotorcycle = new AddMotorcycle(motorcycleRepository);
  });

  afterAll(async () => {
    await databaseConnector.closeConnections();
  });

  beforeEach(async () => {
    await MotorcycleModel.destroy({ where: {} });
  });

  it("should return empty array when no motorcycles exist", async () => {
    const result = await listAllMotorcycles.execute();
    expect(result).toEqual([]);
  });

  it("should return all existing motorcycles", async () => {
    // Créer plusieurs motos
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

    await addMotorcycle.execute(
      "1HGCM82633A789012",
      "Triumph Tiger",
      2023,
      "Available",
      1000,
      "Adventure",
      100,
      "Diesel",
      "Manual",
      20
    );

    const result = await listAllMotorcycles.execute();

    expect(result).toHaveLength(2);
    expect(result.map((m) => m.model)).toContain("Triumph Street Triple");
    expect(result.map((m) => m.model)).toContain("Triumph Tiger");
  });
});
