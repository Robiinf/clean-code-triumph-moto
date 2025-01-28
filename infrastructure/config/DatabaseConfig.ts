import mongoose from "mongoose";
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export interface DatabaseConfig {
  postgres: {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
  };
  mongodb: {
    host: string;
    port: number;
    username: string;
    password: string;
  };
}

const requiredEnvVars = [
  "POSTGRES_PORT",
  "POSTGRES_USER",
  "POSTGRES_PASSWORD",
  "POSTGRES_DB",
  "MONGO_PORT",
  "MONGO_INITDB_ROOT_USERNAME",
  "MONGO_INITDB_ROOT_PASSWORD",
];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable ${envVar}`);
  }
});

export const databaseConfig: DatabaseConfig = {
  postgres: {
    host: process.env.POSTGRES_HOST || "postgres",
    port: parseInt(process.env.POSTGRES_PORT || "5432"),
    username: process.env.POSTGRES_USER!,
    password: process.env.POSTGRES_PASSWORD!,
    database: process.env.POSTGRES_DB!,
  },
  mongodb: {
    host: process.env.MONGO_HOST || "mongodb",
    port: parseInt(process.env.MONGO_PORT || "27017"),
    username: process.env.MONGO_INITDB_ROOT_USERNAME!,
    password: process.env.MONGO_INITDB_ROOT_PASSWORD!,
  },
};

export class DatabaseConnector {
  private static instance: DatabaseConnector;
  private sequelizeConnection: Sequelize;
  private mongoConnection: mongoose.Connection;

  private constructor() {}

  public static getInstance(): DatabaseConnector {
    if (!DatabaseConnector.instance) {
      DatabaseConnector.instance = new DatabaseConnector();
    }

    return DatabaseConnector.instance;
  }

  public async initialize(): Promise<void> {
    try {
      const mongoUrl = `mongodb://${databaseConfig.mongodb.username}:${databaseConfig.mongodb.password}@${databaseConfig.mongodb.host}:${databaseConfig.mongodb.port}`;

      this.mongoConnection = await mongoose.createConnection(mongoUrl, {
        authSource: "admin",
      });

      console.log(
        "databaseConfig.mongodb.host CURRENTLY USED FOR SURE",
        databaseConfig.mongodb.host
      );
      console.log("process.env.MONGO_HOST MAYBE USED", process.env.MONGO_HOST);

      this.sequelizeConnection = new Sequelize({
        dialect: "postgres",
        host: databaseConfig.postgres.host,
        port: databaseConfig.postgres.port,
        username: databaseConfig.postgres.username,
        password: databaseConfig.postgres.password,
        database: databaseConfig.postgres.database,
        logging: false,
        pool: {
          max: 5,
          min: 0,
          idle: 10000,
          acquire: 5000,
        },
      });

      await this.testConnections();
      console.log("Database connections established successfully");
    } catch (error) {
      console.error("Error establishing database connections", error);
      throw new Error(
        `Failed to initialize database connections: ${error.message}`
      );
    }
  }

  private async testConnections(): Promise<void> {
    try {
      // Test MongoDB connection
      if (!this.mongoConnection) {
        throw new Error("MongoDB connection not established");
      }
      await this.mongoConnection.asPromise();
      console.log("MongoDB connection established successfully");

      // Test PostgreSQL connection
      if (!this.sequelizeConnection) {
        throw new Error("PostgreSQL connection not established");
      }
      await this.sequelizeConnection.authenticate();
      console.log("PostgreSQL connection established successfully");
    } catch (error) {
      throw new Error(`Failed to test database connections: ${error.message}`);
    }
  }

  public async closeConnections(): Promise<void> {
    try {
      if (this.mongoConnection) {
        await this.mongoConnection.close();
        console.log("MongoDB connection closed");
      }

      if (this.sequelizeConnection) {
        await this.sequelizeConnection.close();
        console.log("PostgreSQL connection closed");
      }
    } catch (error) {
      throw new Error(`Failed to close database connections: ${error.message}`);
    }
  }

  public getSequelizeConnection(): Sequelize {
    if (!this.sequelizeConnection) {
      throw new Error("Sequelize connection not established");
    }
    return this.sequelizeConnection;
  }

  public getMongoConnection(): mongoose.Connection {
    if (!this.mongoConnection) {
      throw new Error("MongoDB connection not established");
    }
    return this.mongoConnection;
  }
}
