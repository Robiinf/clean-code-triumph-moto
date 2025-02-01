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
    // Nettoyer la table motorcycles avant chaque test
    await databaseConnector
      .getSequelizeConnection()
      .query("DELETE FROM motorcycles");
  });

  it("should successfully add a motorcycle", async () => {
    const result = await addMotorcycle.execute(
      "1HGCM82633A123456", // VIN valide
      "Triumph Street Triple",
      2023,
      "Available",
      5000, // kilométrage
      "Naked",
      95, // puissance
      "Diesel",
      "Manual",
      15 // capacité du réservoir
    );

    expect(result).toBeUndefined();

    // Vérifier que la moto a été créée
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

    // Vérifier qu'aucune moto n'a été créée
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
      "InvalidType", // Type invalide
      95,
      "Diesel",
      "Manual",
      15
    );

    expect(result).toBeInstanceOf(InvalidMotorcycleType);

    // Vérifier qu'aucune moto n'a été créée
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
      "InvalidFuel", // Type de carburant invalide
      "Manual",
      15
    );

    expect(result).toBeInstanceOf(InvalidFuelType);

    // Vérifier qu'aucune moto n'a été créée
    const motorcycles = await motorcycleRepository.findAll();
    expect(motorcycles).toHaveLength(0);
  });

  it("should return error when mileage is negative", async () => {
    const result = await addMotorcycle.execute(
      "1HGCM82633A123456",
      "Triumph Street Triple",
      2023,
      "Available",
      -5000, // Kilométrage négatif
      "Naked",
      95,
      "Diesel",
      "Manual",
      15
    );

    expect(result).toBeInstanceOf(NegativeMileage);

    // Vérifier qu'aucune moto n'a été créée
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
      0 // Capacité invalide
    );

    expect(result).toBeInstanceOf(CapacityNegative);

    // Vérifier qu'aucune moto n'a été créée
    const motorcycles = await motorcycleRepository.findAll();
    expect(motorcycles).toHaveLength(0);
  });
});
