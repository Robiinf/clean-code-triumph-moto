// src/infrastructure/http/nest/modules/motorcycle.module.ts
import { Module } from "@nestjs/common";
import { MotorcycleController } from "../controllers/motorcycle.controller";
import { MotorcycleRepository } from "../../../../application/repositories/MotorcycleRepository";
import { RepositoryFactory } from "../../../config/RepositoryFactory";
import { AddMotorcycle } from "../../../../application/usecases/motorcycle/AddMotorcycle";
import { MOTORCYCLE_REPOSITORY } from "../tokens/motorcycle.tokens";

@Module({
  controllers: [MotorcycleController],
  providers: [
    {
      provide: MOTORCYCLE_REPOSITORY,
      useFactory: () => {
        const repositoryFactory = RepositoryFactory.getInstance();
        return repositoryFactory.getRepository<MotorcycleRepository>(
          "MotorcycleEntity"
        );
      },
    },
    {
      provide: AddMotorcycle,
      useFactory: (repo: MotorcycleRepository) => new AddMotorcycle(repo),
      inject: [MOTORCYCLE_REPOSITORY],
    },
  ],
})
export class MotorcycleModule {}
