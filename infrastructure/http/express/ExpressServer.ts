// src/infrastructure/http/express/ExpressServer.ts
import express, { Express } from "express";
import { ServerInterface } from "../ServerInterface";

export class ExpressServer implements ServerInterface {
  private app: Express;
  private server: any;

  async start(port: number): Promise<void> {
    this.app = express();
    this.app.use(express.json());

    // Configuration de base
    this.app.get("/health", (req, res) => {
      res.json({ status: "Express server is running" });
    });

    // Démarrage du serveur
    this.server = this.app.listen(port, () => {
      console.log(`Express server running on port ${port}`);
    });
  }

  async stop(): Promise<void> {
    if (this.server) {
      await new Promise((resolve, reject) => {
        this.server.close((err: Error) => {
          if (err) reject(err);
          else resolve(true);
        });
      });
    }
  }
}
