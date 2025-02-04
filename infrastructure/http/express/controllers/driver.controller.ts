// src/infrastructure/http/express/controllers/driver.controller.ts
import { Request, Response, NextFunction } from "express";
import { RepositoryFactory } from "../../../config/RepositoryFactory";
import { DriverRepository } from "../../../../application/repositories/DriverRepository";
import { CompanyRepository } from "../../../../application/repositories/CompanyRepository";
import { AddDriver } from "../../../../application/usecases/driver/AddDriver";
import { EditDriver } from "../../../../application/usecases/driver/EditDriver";
import { ListAllDriverByCompany } from "../../../../application/usecases/driver/ListAllDriverByCompany";
import { RemoveDriver } from "../../../../application/usecases/driver/RemoveDriver";
import { ZodDriverValidator } from "../../validation/implementations/zod/ZodDriverValidator";

export class DriverController {
  private driverRepository: DriverRepository;
  private companyRepository: CompanyRepository;
  private validator: ZodDriverValidator;

  constructor() {
    const repositoryFactory = RepositoryFactory.getInstance();
    this.driverRepository =
      repositoryFactory.getRepository<DriverRepository>("DriverEntity");
    this.companyRepository =
      repositoryFactory.getRepository<CompanyRepository>("CompanyEntity");
    this.validator = new ZodDriverValidator();
  }

  createDriver = async (
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

      const addDriverUseCase = new AddDriver(
        this.driverRepository,
        this.companyRepository
      );
      const result = await addDriverUseCase.execute(
        validationResult.data.firstName,
        validationResult.data.lastName,
        validationResult.data.phone,
        validationResult.data.email,
        new Date(validationResult.data.birthDate),
        validationResult.data.companyId,
        validationResult.data.driverLicenseId
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
        message: "Driver created successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  getAllDriversByCompany = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { companyId } = req.params;

      const listDriversUseCase = new ListAllDriverByCompany(
        this.driverRepository
      );

      const result = await listDriversUseCase.execute(companyId);

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

  editDriver = async (
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

      const editDriverUseCase = new EditDriver(this.driverRepository);

      const result = await editDriverUseCase.execute(
        id,
        validationResult.data.firstName,
        validationResult.data.lastName,
        validationResult.data.phone,
        validationResult.data.email,
        new Date(validationResult.data.birthDate),
        validationResult.data.companyId,
        validationResult.data.driverLicenseId
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
        message: "Driver updated successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  deleteDriver = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;

      const removeDriverUseCase = new RemoveDriver(this.driverRepository);
      const result = await removeDriverUseCase.execute(id);

      if (result instanceof Error) {
        res.status(404).json({
          status: "error",
          message: result.name,
        });
        return;
      }

      res.status(204).json({
        status: "success",
        message: "Driver deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}
