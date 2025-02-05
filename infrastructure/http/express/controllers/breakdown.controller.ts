import { Request, Response, NextFunction } from "express";
import { RepositoryFactory } from "../../../config/RepositoryFactory";
import { BreakdownRepository } from "../../../../application/repositories/BreakdownRepository";
import { MotorcycleRepository } from "../../../../application/repositories/MotorcycleRepository";
import { CreateBreakdownReport } from "../../../../application/usecases/breakdown/CreateBreakdownReport";
import { ListBreakdownByVehicle } from "../../../../application/usecases/breakdown/ListBreakdownByVehicule";
import { ZodBreakdownValidator } from "../../validation/implementations/zod/ZodBreakdownValidator";

export class BreakdownController {
  private breakdownRepository: BreakdownRepository;
  private motorcycleRepository: MotorcycleRepository;
  private validator: ZodBreakdownValidator;

  constructor() {
    const repositoryFactory = RepositoryFactory.getInstance();
    this.breakdownRepository =
      repositoryFactory.getRepository<BreakdownRepository>("BreakdownEntity");
    this.motorcycleRepository =
      repositoryFactory.getRepository<MotorcycleRepository>("MotorcycleEntity");
    this.validator = new ZodBreakdownValidator();
  }

  createBreakdown = async (
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

      const createBreakdownUseCase = new CreateBreakdownReport(
        this.breakdownRepository,
        this.motorcycleRepository
      );

      const result = await createBreakdownUseCase.execute(
        new Date(validationResult.data.breakdownDate),
        validationResult.data.breakdownType,
        validationResult.data.breakdownDescription,
        validationResult.data.motorcycleId
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
        message: "Breakdown report created successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  getBreakdownsByVehicle = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { vehicleId } = req.params;

      const listBreakdownsUseCase = new ListBreakdownByVehicle(
        this.breakdownRepository
      );
      const breakdowns = await listBreakdownsUseCase.execute(vehicleId);

      res.status(200).json({
        status: "success",
        data: breakdowns,
      });
    } catch (error) {
      next(error);
    }
  };
}
