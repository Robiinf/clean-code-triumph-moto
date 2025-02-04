import { DatabaseConnector } from "../../../../config/DatabaseConfig";
import { SequelizeMotorcycleRepository } from "../../../../sequelize/repositories/SequelizeMotorcycleRepository";
import { EditMotorcycle } from "../../../../../application/usecases/motorcycle/EditMotorcycle";
import { AddMotorcycle } from "../../../../../application/usecases/motorcycle/AddMotorcycle";
import { MotorcycleModel } from "../../../../sequelize/models/MotorcycleModel";
import { VehicleNotFound } from "../../../../../domain/errors/VehicleNotFound";
import { InvalidVehicleIdentificationNumber } from "../../../../../domain/errors/InvalidVehicleIdentificationNumber";
import { NegativeMileage } from "../../../../../domain/errors/NegativeMileage";
import { InvalidMotorcycleType } from "../../../../../domain/errors/InvalidMotorcycleType";
import { InvalidFuelType } from "../../../../../domain/errors/InvalidFuelType";

describe("EditMotorcycle Integration", () => {
  let editMotorcycle: EditMotorcycle;
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

    editMotorcycle = new EditMotorcycle(motorcycleRepository);
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

  it("should successfully edit a motorcycle", async () => {
    const result = await editMotorcycle.execute(
      testMotorcycleId,
      "1HGCM82633A789012",
      "Triumph Street Triple RS",
      2024,
      "Maintenance",
      7500,
      "Naked",
      100,
      "Diesel",
      "Manual",
      15
    );

    expect(result).toBeUndefined();

    const updatedMotorcycle = await motorcycleRepository.findById(
      testMotorcycleId
    );
    expect(updatedMotorcycle).not.toBeNull();
    expect(updatedMotorcycle?.vin.value).toBe("1HGCM82633A789012");
    expect(updatedMotorcycle?.model).toBe("Triumph Street Triple RS");
    expect(updatedMotorcycle?.year).toBe(2024);
    expect(updatedMotorcycle?.status).toBe("Maintenance");
    expect(updatedMotorcycle?.mileageInKilometers.value).toBe(7500);
    expect(updatedMotorcycle?.power).toBe(100);
  });

  it("should return error when motorcycle doesn't exist", async () => {
    try {
      const result = await editMotorcycle.execute(
        "non-existent-id",
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

      expect(result).toBeInstanceOf(VehicleNotFound);
    } catch (error) {
      console.error("Error in test:", error);
      throw error;
    }
  });

  it("should return error when VIN is invalid", async () => {
    const result = await editMotorcycle.execute(
      testMotorcycleId,
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

    const motorcycle = await motorcycleRepository.findById(testMotorcycleId);
    expect(motorcycle?.vin.value).toBe("1HGCM82633A123456");
  });

  it("should return error when motorcycle type is invalid", async () => {
    const result = await editMotorcycle.execute(
      testMotorcycleId,
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
  });

  it("should return error when mileage is invalid", async () => {
    const result = await editMotorcycle.execute(
      testMotorcycleId,
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
  });

  it("should return error when fuel type is invalid", async () => {
    const result = await editMotorcycle.execute(
      testMotorcycleId,
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
  });
});
