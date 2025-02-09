import { Request, Response, NextFunction } from "express";
import { RepositoryFactory } from "../../../config/RepositoryFactory";
import { DriverRepository } from "../../../../application/repositories/DriverRepository";
import { MotorcycleRepository } from "../../../../application/repositories/MotorcycleRepository";
import { TestDriveRepository } from "../../../../application/repositories/TestDriveRepository";
import { ZodTestDriveValidator } from "../../validation/implementations/zod/ZodTestDriveValidator";
import { CreateTestDrive } from "../../../../application/usecases/testDrive/CreateTestDrive";
import { ListTestDriveByDriver } from "../../../../application/usecases/testDrive/ListTestDriveByDriver";
import { ListTestDriveByVehicule } from "../../../../application/usecases/testDrive/ListTestDriveByVehicule";
import { ListAllTestDrive } from "../../../../application/usecases/testDrive/ListAllTestDrive";

export class TestDriveController {
  private driverRepository: DriverRepository;
  private motorcycleRepository: MotorcycleRepository;
  private testDriveRepository: TestDriveRepository;
  private validator: ZodTestDriveValidator;

  constructor() {
    const repositoryFactory = RepositoryFactory.getInstance();
    this.driverRepository =
      repositoryFactory.getRepository<DriverRepository>("DriverEntity");
    this.motorcycleRepository =
      repositoryFactory.getRepository<MotorcycleRepository>("MotorcycleEntity");
    this.testDriveRepository =
      repositoryFactory.getRepository<TestDriveRepository>("TestDriveEntity");
    this.validator = new ZodTestDriveValidator();
  }

  createTestDrive = async (
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

      const createTestDriveUseCase = new CreateTestDrive(
        this.testDriveRepository,
        this.motorcycleRepository,
        this.driverRepository
      );

      const result = await createTestDriveUseCase.execute(
        validationResult.data.driverId,
        validationResult.data.motorcycleId,
        new Date(validationResult.data.sessionDate),
        validationResult.data.sessionDetails
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

  listAllTestDrive = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const listAllTestDriveUseCase = new ListAllTestDrive(
        this.testDriveRepository
      );

      const result = await listAllTestDriveUseCase.execute();

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

  listTestDriveByDriver = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const driverId = req.params.driverId;

      const listTestDriveByDriverUseCase = new ListTestDriveByDriver(
        this.testDriveRepository
      );

      const result = await listTestDriveByDriverUseCase.execute(driverId);

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

  listTestDriveByVehicule = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const motorcycleId = req.params.motorcycleId;

      const listTestDriveByVehiculeUseCase = new ListTestDriveByVehicule(
        this.testDriveRepository
      );

      const result = await listTestDriveByVehiculeUseCase.execute(motorcycleId);

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
}
