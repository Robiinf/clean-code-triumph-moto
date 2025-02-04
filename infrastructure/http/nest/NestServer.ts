import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules/app.module";
import { ServerInterface } from "../ServerInterface";
import { INestApplication } from "@nestjs/common";
import { DatabaseConnector } from "../../config/DatabaseConfig";
import { MotorcycleModel } from "../../sequelize/models/MotorcycleModel";

export class NestServer implements ServerInterface {
  private app: INestApplication;
  private databaseConnector: DatabaseConnector;

  constructor() {
    this.databaseConnector = DatabaseConnector.getInstance();
  }

  async start(port: number): Promise<void> {
    try {
      await this.databaseConnector.initialize();

      const sequelize = this.databaseConnector.getSequelizeConnection();
      await MotorcycleModel.initModel(sequelize);
      await MotorcycleModel.sync({ force: false });

      this.app = await NestFactory.create(AppModule);

      this.app.enableCors();

      await this.app.listen(port);
      console.log(`NestJS server running on port ${port}`);
    } catch (error) {
      console.error("Failed to start NestJS server:", error);
      throw error;
    }
  }

  async stop(): Promise<void> {
    if (this.app) {
      await this.app.close();
    }
    await this.databaseConnector.closeConnections();
  }
}
