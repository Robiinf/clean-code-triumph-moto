// src/infrastructure/http/nest/modules/motorcycle.module.ts
import { Module } from "@nestjs/common";
import { MotorcycleController } from "../controllers/motorcycle.controller";
import { MotorcycleRepository } from "../../../../application/repositories/MotorcycleRepository";
import { RepositoryFactory } from "../../../config/RepositoryFactory";
import { AddMotorcycle } from "../../../../application/usecases/motorcycle/AddMotorcycle";
import { ListAllMotorcycles } from "../../../../application/usecases/motorcycle/ListAllMotorcycles";
import { GetMotorcycleById } from "../../../../application/usecases/motorcycle/GetMotorcycleById";
import { RemoveMotorcycle } from "../../../../application/usecases/motorcycle/RemoveMotorcycle";
import { EditMotorcycle } from "../../../../application/usecases/motorcycle/EditMotorcycle";
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
    {
      provide: ListAllMotorcycles,
      useFactory: (repo: MotorcycleRepository) => new ListAllMotorcycles(repo),
      inject: [MOTORCYCLE_REPOSITORY],
    },
    {
      provide: GetMotorcycleById,
      useFactory: (repo: MotorcycleRepository) => new GetMotorcycleById(repo),
      inject: [MOTORCYCLE_REPOSITORY],
    },
    {
      provide: RemoveMotorcycle,
      useFactory: (repo: MotorcycleRepository) => new RemoveMotorcycle(repo),
      inject: [MOTORCYCLE_REPOSITORY],
    },
    {
      provide: EditMotorcycle,
      useFactory: (repo: MotorcycleRepository) => new EditMotorcycle(repo),
      inject: [MOTORCYCLE_REPOSITORY],
    },
  ],
})
export class MotorcycleModule {}
