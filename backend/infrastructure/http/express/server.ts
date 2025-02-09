import "reflect-metadata";
import { ExpressServer } from "./ExpressServer";

async function bootstrap() {
  const expressServer = new ExpressServer();
  await expressServer.start(3000);

  process.on("SIGTERM", async () => {
    await expressServer.stop();
    process.exit(0);
  });
}

bootstrap();
