import { Request, Response, NextFunction } from "express";
import { RepositoryFactory } from "../../../config/RepositoryFactory";
import { WarrantyRepository } from "../../../../application/repositories/WarrantyRepository";
import { MotorcycleRepository } from "../../../../application/repositories/MotorcycleRepository";
import { ZodWarrantyValidator } from "../../validation/implementations/zod/ZodWarrantyValidator";
import { AddWarranty } from "../../../../application/usecases/warranty/AddWarranty";
import { ListWarrantiesByVehicle } from "../../../../application/usecases/warranty/ListWarrantiesByVehicule";
import { GetWarrantyById } from "../../../../application/usecases/warranty/GetWarrantyById";
import { UpdateWarrantyStatus } from "../../../../application/usecases/warranty/UpdateWarrantyStatus";
import { ExtendWarranty } from "../../../../application/usecases/warranty/ExtendWarranty";

export class WarrantyController {
  private warrantyRepository: WarrantyRepository;
  private motorcycleRepository: MotorcycleRepository;
  private validator: ZodWarrantyValidator;

  constructor() {
    const repositoryFactory = RepositoryFactory.getInstance();
    this.warrantyRepository =
      repositoryFactory.getRepository<WarrantyRepository>("WarrantyEntity");
    this.motorcycleRepository =
      repositoryFactory.getRepository<MotorcycleRepository>("MotorcycleEntity");
    this.validator = new ZodWarrantyValidator();
  }

  createWarranty = async (
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

      const addWarrantyUseCase = new AddWarranty(
        this.warrantyRepository,
        this.motorcycleRepository
      );
      const result = await addWarrantyUseCase.execute(
        new Date(validationResult.data.startDate),
        new Date(validationResult.data.endDate),
        validationResult.data.warrantyType,
        validationResult.data.motorcyleId,
        validationResult.data.warrantyDescription
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
        message: "Warranty created successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  getWarrantiesByVehicle = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { vehicleId } = req.params;

      const listWarrantiesUseCase = new ListWarrantiesByVehicle(
        this.warrantyRepository
      );
      const warranties = await listWarrantiesUseCase.execute(vehicleId);

      res.status(200).json({
        status: "success",
        data: warranties,
      });
    } catch (error) {
      next(error);
    }
  };

  getWarrantyById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;

      const getWarrantyByIdUseCase = new GetWarrantyById(
        this.warrantyRepository
      );
      const result = await getWarrantyByIdUseCase.execute(id);

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

  updateWarrantyStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        res.status(400).json({
          status: "error",
          message: "Status is required",
        });
        return;
      }

      const updateStatusUseCase = new UpdateWarrantyStatus(
        this.warrantyRepository
      );
      const result = await updateStatusUseCase.execute(id, status);

      if (result instanceof Error) {
        res.status(400).json({
          status: "error",
          message: result.name,
        });
        return;
      }

      res.status(200).json({
        status: "success",
        message: "Warranty status updated successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  extendWarranty = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const { endDate } = req.body;

      if (!endDate) {
        res.status(400).json({
          status: "error",
          message: "New end date is required",
        });
        return;
      }

      const newEndDate = new Date(endDate);
      if (isNaN(newEndDate.getTime())) {
        res.status(400).json({
          status: "error",
          message: "Invalid date format",
        });
        return;
      }

      const extendWarrantyUseCase = new ExtendWarranty(this.warrantyRepository);
      const result = await extendWarrantyUseCase.execute(id, newEndDate);

      if (result instanceof Error) {
        res.status(400).json({
          status: "error",
          message: result.name,
        });
        return;
      }

      res.status(200).json({
        status: "success",
        message: "Warranty extended successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}
