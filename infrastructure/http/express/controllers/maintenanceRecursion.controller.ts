import { Request, Response, NextFunction } from "express";
import { RepositoryFactory } from "../../../config/RepositoryFactory";
import { MaintenanceRecursionRepository } from "../../../../application/repositories/MaintenanceRecursionRepository";
import { MotorcycleRepository } from "../../../../application/repositories/MotorcycleRepository";
import { CreateMaintenanceRecursion } from "../../../../application/usecases/maintenanceRecursion/CreateMaintenanceRecursion";
import { UpdateMaintenanceRecursion } from "../../../../application/usecases/maintenanceRecursion/UpdateMaintenanceRecursion";
import { GetMaintenanceRecursionsByMotorcycle } from "../../../../application/usecases/maintenanceRecursion/GetMaintenanceRecursionsByMotorcycle";
import { DeleteMaintenanceRecursion } from "../../../../application/usecases/maintenanceRecursion/DeleteMaintenanceRecursion";
import { ZodMaintenanceRecursionValidator } from "../../validation/implementations/zod/ZodMaintenanceRecursionValidator";

export class MaintenanceRecursionController {
  private maintenanceRecursionRepository: MaintenanceRecursionRepository;
  private motorcycleRepository: MotorcycleRepository;
  private validator: ZodMaintenanceRecursionValidator;

  constructor() {
    const repositoryFactory = RepositoryFactory.getInstance();
    this.maintenanceRecursionRepository =
      repositoryFactory.getRepository<MaintenanceRecursionRepository>(
        "MaintenanceRecursionEntity"
      );
    this.motorcycleRepository =
      repositoryFactory.getRepository<MotorcycleRepository>("MotorcycleEntity");
    this.validator = new ZodMaintenanceRecursionValidator();
  }

  createMaintenanceRecursion = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const validationResult = await this.validator.validate(req.body);

      if (!validationResult.success) {
        res.status(400).json({
          status: "error",
          errors: validationResult.errors,
        });
        return;
      }

      const createMaintenanceUseCase = new CreateMaintenanceRecursion(
        this.maintenanceRecursionRepository,
        this.motorcycleRepository
      );

      const result = await createMaintenanceUseCase.execute(
        validationResult.data.motorcycleId,
        validationResult.data.description,
        validationResult.data.intervalKm,
        validationResult.data.intervalMonths
      );

      if (result instanceof Error) {
        res.status(400).json({
          status: "error",
          message: result.message,
        });
        return;
      }

      res.status(201).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  updateMaintenanceRecursion = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const validationResult = await this.validator.validate(req.body);

      if (!validationResult.success) {
        res.status(400).json({
          status: "error",
          errors: validationResult.errors,
        });
        return;
      }

      const updateMaintenanceUseCase = new UpdateMaintenanceRecursion(
        this.maintenanceRecursionRepository
      );

      const result = await updateMaintenanceUseCase.execute(
        id,
        validationResult.data.description,
        validationResult.data.intervalKm,
        validationResult.data.intervalMonths
      );

      if (result instanceof Error) {
        res.status(400).json({
          status: "error",
          message: result.message,
        });
        return;
      }

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getMaintenancesRecursionByMotorcycle = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { motorcycleId } = req.params;

      const getMaintenancesUseCase = new GetMaintenanceRecursionsByMotorcycle(
        this.maintenanceRecursionRepository
      );

      const maintenances = await getMaintenancesUseCase.execute(motorcycleId);

      res.status(200).json({
        status: "success",
        data: maintenances,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteMaintenanceRecursion = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;

      const deleteMaintenanceUseCase = new DeleteMaintenanceRecursion(
        this.maintenanceRecursionRepository
      );

      const result = await deleteMaintenanceUseCase.execute(id);

      if (result instanceof Error) {
        res.status(400).json({
          status: "error",
          message: result.message,
        });
        return;
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
