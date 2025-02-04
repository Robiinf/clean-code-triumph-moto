// src/infrastructure/http/express/ExpressServer.ts
import express, { Express } from "express";
import { ServerInterface } from "../ServerInterface";
import { DatabaseConnector } from "../../config/DatabaseConfig";
import { companyRoutes } from "./routes/company.routes";
import { driverRoutes } from "./routes/driver.routes";

export class ExpressServer implements ServerInterface {
  private app: Express;
  private databaseConnector: DatabaseConnector;

  constructor() {
    this.app = express();
    this.databaseConnector = DatabaseConnector.getInstance();
  }

  async start(port: number): Promise<void> {
    try {
      // Initialiser les connexions DB
      await this.databaseConnector.initialize();

      // Middleware
      this.app.use(express.json());

      // Routes
      this.app.use("/api", companyRoutes());
      this.app.use("/api", driverRoutes());

      // health check
      this.app.get("/health", (req, res) => {
        res.send("Server is up and running");
      });

      await new Promise<void>((resolve) => {
        this.app.listen(port, () => {
          console.log(`Express server running on port ${port}`);
          resolve();
        });
      });
    } catch (error) {
      console.error("Failed to start Express server:", error);
      throw error;
    }
  }

  async stop(): Promise<void> {
    await this.databaseConnector.closeConnections();
  }
}
