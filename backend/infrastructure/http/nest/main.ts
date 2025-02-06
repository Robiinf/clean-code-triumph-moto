import "reflect-metadata";
import { NestServer } from "./NestServer";

async function bootstrap() {
  const nestServer = new NestServer();
  await nestServer.start(3001);

  process.on("SIGTERM", async () => {
    await nestServer.stop();
    process.exit(0);
  });
}
bootstrap();
