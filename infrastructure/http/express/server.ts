// src/infrastructure/http/express/main.ts
import "reflect-metadata";
import { ExpressServer } from "./ExpressServer";

async function bootstrap() {
  const expressServer = new ExpressServer();
  await expressServer.start(3000);

  // Gestion de l'arrêt gracieux
  process.on("SIGTERM", async () => {
    await expressServer.stop();
    process.exit(0);
  });
}

bootstrap();
