import { AddMotorcycle } from "../../../../../application/usecases/motorcycle/AddMotorcycle";
import { SequelizeMotorcycleRepository } from "../../../../sequelize/repositories/SequelizeMotorcycleRepository";
import { DatabaseConnector } from "../../../../config/DatabaseConfig";
import { InvalidVehicleIdentificationNumber } from "../../../../../domain/errors/InvalidVehicleIdentificationNumber";
import { InvalidMotorcycleType } from "../../../../../domain/errors/InvalidMotorcycleType";
import { InvalidFuelType } from "../../../../../domain/errors/InvalidFuelType";
import { NegativeMileage } from "../../../../../domain/errors/NegativeMileage";
import { CapacityNegative } from "../../../../../domain/errors/CapacityNegativ";
import { MotorcycleModel } from "../../../../sequelize/models/MotorcycleModel";

describe("AddMotorcycle Integration", () => {
  let addMotorcycle: AddMotorcycle;
  let motorcycleRepository: SequelizeMotorcycleRepository;
  let databaseConnector: DatabaseConnector;

  beforeAll(async () => {
    try {
      databaseConnector = DatabaseConnector.getInstance();
      await databaseConnector.initialize();

      const sequelize = databaseConnector.getSequelizeConnection();
      motorcycleRepository = new SequelizeMotorcycleRepository(sequelize);

      await MotorcycleModel.sync({ force: true });

      addMotorcycle = new AddMotorcycle(motorcycleRepository);
      console.log("Database connection has been established successfully.");
    } catch (err) {
      console.error("Unable to connect to the database:", err);
      throw err;
    }
  });

  afterAll(async () => {
    await databaseConnector.closeConnections();
  });

  beforeEach(async () => {
    await databaseConnector
      .getSequelizeConnection()
      .query("DELETE FROM motorcycles");
  });

  it("should successfully add a motorcycle", async () => {
    const result = await addMotorcycle.execute(
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

    expect(result).toBeUndefined();

    const motorcycles = await motorcycleRepository.findAll();
    expect(motorcycles).toHaveLength(1);
    expect(motorcycles[0].model).toBe("Triumph Street Triple");
    expect(motorcycles[0].vin.value).toBe("1HGCM82633A123456");
    expect(motorcycles[0].motorcycleType.value).toBe("Naked");
    expect(motorcycles[0].fuelType.value).toBe("Diesel");
  });

  it("should return error when VIN is invalid", async () => {
    const result = await addMotorcycle.execute(
      "invalid-vin",
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

    expect(result).toBeInstanceOf(InvalidVehicleIdentificationNumber);

    const motorcycles = await motorcycleRepository.findAll();
    expect(motorcycles).toHaveLength(0);
  });

  it("should return error when motorcycle type is invalid", async () => {
    const result = await addMotorcycle.execute(
      "1HGCM82633A123456",
      "Triumph Street Triple",
      2023,
      "Available",
      5000,
      "InvalidType",
      95,
      "Diesel",
      "Manual",
      15
    );

    expect(result).toBeInstanceOf(InvalidMotorcycleType);

    const motorcycles = await motorcycleRepository.findAll();
    expect(motorcycles).toHaveLength(0);
  });

  it("should return error when fuel type is invalid", async () => {
    const result = await addMotorcycle.execute(
      "1HGCM82633A123456",
      "Triumph Street Triple",
      2023,
      "Available",
      5000,
      "Naked",
      95,
      "InvalidFuel",
      "Manual",
      15
    );

    expect(result).toBeInstanceOf(InvalidFuelType);

    const motorcycles = await motorcycleRepository.findAll();
    expect(motorcycles).toHaveLength(0);
  });

  it("should return error when mileage is negative", async () => {
    const result = await addMotorcycle.execute(
      "1HGCM82633A123456",
      "Triumph Street Triple",
      2023,
      "Available",
      -5000,
      "Naked",
      95,
      "Diesel",
      "Manual",
      15
    );

    expect(result).toBeInstanceOf(NegativeMileage);

    const motorcycles = await motorcycleRepository.findAll();
    expect(motorcycles).toHaveLength(0);
  });

  it("should return error when fuel capacity is invalid", async () => {
    const result = await addMotorcycle.execute(
      "1HGCM82633A123456",
      "Triumph Street Triple",
      2023,
      "Available",
      5000,
      "Naked",
      95,
      "Diesel",
      "Manual",
      0
    );

    expect(result).toBeInstanceOf(CapacityNegative);

    const motorcycles = await motorcycleRepository.findAll();
    expect(motorcycles).toHaveLength(0);
  });
});
