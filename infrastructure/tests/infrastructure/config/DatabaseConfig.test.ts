// tests/infrastructure/config/DatabaseConfig.test.ts
import { DatabaseConnector } from "../../../config/DatabaseConfig";
import mongoose from "mongoose";
import { Sequelize } from "sequelize";

describe("DatabaseConnector", () => {
  let databaseConnector: DatabaseConnector;

  beforeEach(() => {
    // Réinitialiser l'instance avant chaque test
    databaseConnector = DatabaseConnector.getInstance();
  });

  afterEach(async () => {
    // Fermer les connexions après chaque test
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

      // Vérifier que les connexions sont établies
      const mongoConnection = databaseConnector.getMongoConnection();
      const sequelizeConnection = databaseConnector.getSequelizeConnection();

      expect(mongoConnection).toBeDefined();
      expect(mongoConnection.readyState).toBe(1); // 1 = connected

      expect(sequelizeConnection).toBeDefined();
      expect(sequelizeConnection).toBeInstanceOf(Sequelize);
    });

    it("should throw error if MongoDB connection fails", async () => {
      // Simuler une erreur de connexion MongoDB en modifiant temporairement les variables d'environnement
      const originalMongoHost = process.env.MONGO_HOST;
      process.env.MONGO_HOST = "invalid-host";

      await expect(databaseConnector.initialize()).rejects.toThrow();

      // Restaurer la variable d'environnement
      process.env.MONGO_HOST = originalMongoHost;
      console.log("process.env.MONGO_HOST", process.env.MONGO_HOST);
    });

    it("should throw error if PostgreSQL connection fails", async () => {
      // Simuler une erreur de connexion PostgreSQL
      const originalPgHost = process.env.POSTGRES_HOST;
      process.env.POSTGRES_HOST = "invalid-host";

      await expect(databaseConnector.initialize()).rejects.toThrow();

      // Restaurer la variable d'environnement
      process.env.POSTGRES_HOST = originalPgHost;
      console.log("process.env.POSTGRES_HOST", process.env.POSTGRES_HOST);
    });
  });

  /*   describe("getConnections", () => {
    it("should throw error when getting MongoDB connection before initialization", () => {
      expect(() => databaseConnector.getMongoConnection()).toThrow();
    });

    it("should throw error when getting PostgreSQL connection before initialization", () => {
      expect(() => databaseConnector.getSequelizeConnection()).toThrow();
    });

    it("should return valid connections after initialization", async () => {
      await databaseConnector.initialize();

      expect(() => databaseConnector.getMongoConnection()).not.toThrow();
      expect(() => databaseConnector.getSequelizeConnection()).not.toThrow();
    });
  });

  describe("closeConnections", () => {
    it("should successfully close all connections", async () => {
      await databaseConnector.initialize();
      await expect(databaseConnector.closeConnections()).resolves.not.toThrow();

      // Vérifier que les connexions sont fermées
      const mongoConnection = databaseConnector.getMongoConnection();
      expect(mongoConnection.readyState).toBe(0); // 0 = disconnected
    });
  }); */
});
