import { Request, Response, NextFunction } from "express";
import { RepositoryFactory } from "../../../config/RepositoryFactory";
import { DriverLicenseRepository } from "../../../../application/repositories/DriverLicenseRepository";
import { DriverRepository } from "../../../../application/repositories/DriverRepository";
import { AddDriverLicense } from "../../../../application/usecases/driverLicense/AddDriverLicense";
import { GetDriverLicense } from "../../../../application/usecases/driverLicense/GetDriverLicense";
import { EditDriverLicense } from "../../../../application/usecases/driverLicense/EditDriverLicense";
import { RemoveDriverLicense } from "../../../../application/usecases/driverLicense/RemoveDriverLicense";
import { ZodDriverLicenseValidator } from "../../validation/implementations/zod/ZodDriverLicenseValidator";

export class DriverLicenseController {
  private driverLicenseRepository: DriverLicenseRepository;
  private driverRepository: DriverRepository;
  private validator: ZodDriverLicenseValidator;

  constructor() {
    const repositoryFactory = RepositoryFactory.getInstance();
    this.driverLicenseRepository =
      repositoryFactory.getRepository<DriverLicenseRepository>(
        "DriverLicenseEntity"
      );
    this.driverRepository =
      repositoryFactory.getRepository<DriverRepository>("DriverEntity");
    this.validator = new ZodDriverLicenseValidator();
  }

  createDriverLicense = async (
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

      const addDriverLicenseUseCase = new AddDriverLicense(
        this.driverLicenseRepository,
        this.driverRepository
      );

      const result = await addDriverLicenseUseCase.execute(
        validationResult.data.licenseNumber,
        new Date(validationResult.data.issueDate),
        new Date(validationResult.data.expirationDate),
        validationResult.data.status,
        validationResult.data.categories,
        validationResult.data.driverId
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
        message: "Driver license created successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  getDriverLicense = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;

      const getDriverLicenseUseCase = new GetDriverLicense(
        this.driverLicenseRepository
      );

      const result = await getDriverLicenseUseCase.execute(id);

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

  editDriverLicense = async (
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

      const editDriverLicenseUseCase = new EditDriverLicense(
        this.driverLicenseRepository,
        this.driverRepository
      );

      const result = await editDriverLicenseUseCase.execute(
        id,
        validationResult.data.licenseNumber,
        new Date(validationResult.data.issueDate),
        new Date(validationResult.data.expirationDate),
        validationResult.data.status,
        validationResult.data.categories
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
        message: "Driver license updated successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  deleteDriverLicense = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;

      const removeDriverLicenseUseCase = new RemoveDriverLicense(
        this.driverLicenseRepository,
        this.driverRepository
      );
      const result = await removeDriverLicenseUseCase.execute(id);

      if (result instanceof Error) {
        res.status(404).json({
          status: "error",
          message: result.name,
        });
        return;
      }

      res.status(204).json({
        status: "success",
        message: "Driver license deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}
