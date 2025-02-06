import { Request, Response, NextFunction } from "express";
import { RepositoryFactory } from "../../../config/RepositoryFactory";
import { MaintenanceRepository } from "../../../../application/repositories/MaintenanceRepository";
import { MotorcycleRepository } from "../../../../application/repositories/MotorcycleRepository";
import { SparePartRepository } from "../../../../application/repositories/SparePartRepository";
import { CreateMaintenance } from "../../../../application/usecases/maintenance/CreateMaintenance";
import { UpdateMaintenance } from "../../../../application/usecases/maintenance/UpdateMaintenance";
import { GetMaintenancesByMotorcycle } from "../../../../application/usecases/maintenance/GetMaintenancesByMotorcycle";
import { GetMaintenanceByBreakdown } from "../../../../application/usecases/maintenance/GetMaintenanceByBreakdown";
import { ZodMaintenanceValidator } from "../../validation/implementations/zod/ZodMaintenanceValidator";
import { MaintenanceRecursionRepository } from "../../../../application/repositories/MaintenanceRecursionRepository";

export class MaintenanceController {
  private maintenanceRepository: MaintenanceRepository;
  private motorcycleRepository: MotorcycleRepository;
  private sparePartRepository: SparePartRepository;
  private maintenanceRecursionRepository: MaintenanceRecursionRepository;
  private validator: ZodMaintenanceValidator;

  constructor() {
    const repositoryFactory = RepositoryFactory.getInstance();
    this.maintenanceRepository =
      repositoryFactory.getRepository<MaintenanceRepository>(
        "MaintenanceEntity"
      );
    this.motorcycleRepository =
      repositoryFactory.getRepository<MotorcycleRepository>("MotorcycleEntity");
    this.sparePartRepository =
      repositoryFactory.getRepository<SparePartRepository>("SparePartEntity");
    this.maintenanceRecursionRepository =
      repositoryFactory.getRepository<MaintenanceRecursionRepository>(
        "MaintenanceRecursionEntity"
      );
    this.validator = new ZodMaintenanceValidator();
  }

  createMaintenance = async (
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

      const createMaintenanceUseCase = new CreateMaintenance(
        this.maintenanceRepository,
        this.motorcycleRepository,
        this.maintenanceRecursionRepository,
        this.sparePartRepository
      );

      const result = await createMaintenanceUseCase.execute(
        validationResult.data.motorcycleId,
        new Date(validationResult.data.maintenanceDate),
        validationResult.data.maintenanceType,
        validationResult.data.description,
        validationResult.data.techniciansRecommendation,
        validationResult.data.replacedParts,
        validationResult.data.breakdownId,
        validationResult.data.maintenanceRecursionId
      );

      if (result instanceof Error) {
        res.status(400).json({
          status: "error",
          message: result.name,
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

  updateMaintenance = async (
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

      const updateMaintenanceUseCase = new UpdateMaintenance(
        this.maintenanceRepository,
        this.sparePartRepository
      );

      const result = await updateMaintenanceUseCase.execute(
        id,
        validationResult.data.description,
        validationResult.data.techniciansRecommendation,
        validationResult.data.replacedParts
      );

      if (result instanceof Error) {
        res.status(400).json({
          status: "error",
          message: result.name,
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

  getMaintenancesByMotorcycle = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { motorcycleId } = req.params;

      const getMaintenancesUseCase = new GetMaintenancesByMotorcycle(
        this.maintenanceRepository
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

  getMaintenanceByBreakdown = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { breakdownId } = req.params;

      const getMaintenanceUseCase = new GetMaintenanceByBreakdown(
        this.maintenanceRepository
      );
      const result = await getMaintenanceUseCase.execute(breakdownId);

      if (result instanceof Error) {
        res.status(404).json({
          status: "error",
          message: result.name,
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
}
