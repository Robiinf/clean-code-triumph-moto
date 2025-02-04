import { DatabaseConnector } from "../../../config/DatabaseConfig";
import mongoose from "mongoose";
import { Sequelize } from "sequelize";

describe("DatabaseConnector", () => {
  let databaseConnector: DatabaseConnector;

  beforeEach(() => {
    databaseConnector = DatabaseConnector.getInstance();
  });

  afterEach(async () => {
    await databaseConnector.closeConnections();
  });

  describe("getInstance", () => {
    it("should return the same instance", () => {
      const instance1 = DatabaseConnector.getInstance();
      const instance2 = DatabaseConnector.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe("initialize", () => {
    it("should successfully connect to both databases", async () => {
      await expect(databaseConnector.initialize()).resolves.not.toThrow();

      const mongoConnection = databaseConnector.getMongoConnection();
      const sequelizeConnection = databaseConnector.getSequelizeConnection();

      expect(mongoConnection).toBeDefined();
      expect(mongoConnection.readyState).toBe(1);

      expect(sequelizeConnection).toBeDefined();
      expect(sequelizeConnection).toBeInstanceOf(Sequelize);
    });

    it("should throw error if MongoDB connection fails", async () => {
      const originalMongoHost = process.env.MONGO_HOST;
      process.env.MONGO_HOST = "invalid-host";

      await expect(databaseConnector.initialize()).rejects.toThrow();

      process.env.MONGO_HOST = originalMongoHost;
      console.log("process.env.MONGO_HOST", process.env.MONGO_HOST);
    });

    it("should throw error if PostgreSQL connection fails", async () => {
      const originalPgHost = process.env.POSTGRES_HOST;
      process.env.POSTGRES_HOST = "invalid-host";

      await expect(databaseConnector.initialize()).rejects.toThrow();

      process.env.POSTGRES_HOST = originalPgHost;
      console.log("process.env.POSTGRES_HOST", process.env.POSTGRES_HOST);
    });
  });
});
