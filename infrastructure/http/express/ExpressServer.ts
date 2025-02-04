import express, { Express } from "express";
import { ServerInterface } from "../ServerInterface";
import { DatabaseConnector } from "../../config/DatabaseConfig";
import { companyRoutes } from "./routes/company.routes";
import { driverLicenseRoutes } from "./routes/driverLicense.routes";
import { driverRoutes } from "./routes/driver.routes";
import { incidentRoutes } from "./routes/incident.routes";

export class ExpressServer implements ServerInterface {
  private app: Express;
  private databaseConnector: DatabaseConnector;

  constructor() {
    this.app = express();
    this.databaseConnector = DatabaseConnector.getInstance();
  }

  async start(port: number): Promise<void> {
    try {
      await this.databaseConnector.initialize();

      this.app.use(express.json());

      this.app.use("/api", companyRoutes());
      this.app.use("/api", driverRoutes());
      this.app.use("/api", driverLicenseRoutes());
      this.app.use("/api", incidentRoutes());

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
