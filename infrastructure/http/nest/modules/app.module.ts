// src/infrastructure/http/nest/modules/app.module.ts
import { Module } from "@nestjs/common";
import { HealthController } from "../controllers/health.controller";
import { MotorcycleModule } from "./motorcycle.module";

@Module({
  imports: [MotorcycleModule],
  controllers: [HealthController],
})
export class AppModule {}
