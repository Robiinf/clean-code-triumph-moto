import { Request, Response, NextFunction } from "express";
import { RepositoryFactory } from "../../../config/RepositoryFactory";
import { IncidentRepository } from "../../../../application/repositories/IncidentRepository";
import { DriverRepository } from "../../../../application/repositories/DriverRepository";
import { MotorcycleRepository } from "../../../../application/repositories/MotorcycleRepository";
import { CreateIncidentReport } from "../../../../application/usecases/incident/CreateIncidentReport";
import { EditIncident } from "../../../../application/usecases/incident/EditIncident";
import { GetIncidentById } from "../../../../application/usecases/incident/GetIncidentById";
import { ListIncidentsByDriver } from "../../../../application/usecases/incident/ListIncidentsByDriver";
import { ListIncidentsByMotorcycle } from "../../../../application/usecases/incident/ListIncidentsByMotorcycle";
import { ZodIncidentValidator } from "../../validation/implementations/zod/ZodIncidentValidator";

export class IncidentController {
  private incidentRepository: IncidentRepository;
  private driverRepository: DriverRepository;
  private motorcycleRepository: MotorcycleRepository;
  private validator: ZodIncidentValidator;

  constructor() {
    const repositoryFactory = RepositoryFactory.getInstance();
    this.incidentRepository =
      repositoryFactory.getRepository<IncidentRepository>("IncidentEntity");
    this.driverRepository =
      repositoryFactory.getRepository<DriverRepository>("DriverEntity");
    this.motorcycleRepository =
      repositoryFactory.getRepository<MotorcycleRepository>("MotorcycleEntity");
    this.validator = new ZodIncidentValidator();
  }

  createIncident = async (
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

      const createIncidentUseCase = new CreateIncidentReport(
        this.incidentRepository,
        this.driverRepository,
        this.motorcycleRepository
      );

      const result = await createIncidentUseCase.execute(
        validationResult.data.driverId,
        validationResult.data.motorcycleId,
        new Date(validationResult.data.incidentDate),
        validationResult.data.incidentDetails
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
        message: "Incident report created successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  getIncidentById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;

      const getIncidentByIdUseCase = new GetIncidentById(
        this.incidentRepository
      );
      const result = await getIncidentByIdUseCase.execute(id);

      if (result instanceof Error) {
        res.status(404).json({
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

  getIncidentsByDriver = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { driverId } = req.params;

      const listIncidentsByDriverUseCase = new ListIncidentsByDriver(
        this.incidentRepository
      );
      const result = await listIncidentsByDriverUseCase.execute(driverId);

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getIncidentsByMotorcycle = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { motorcycleId } = req.params;

      const listIncidentsByMotorcycleUseCase = new ListIncidentsByMotorcycle(
        this.incidentRepository
      );
      const result = await listIncidentsByMotorcycleUseCase.execute(
        motorcycleId
      );

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  editIncident = async (
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

      const editIncidentUseCase = new EditIncident(this.incidentRepository);

      const result = await editIncidentUseCase.execute(
        id,
        validationResult.data.driverId,
        validationResult.data.motorcycleId,
        new Date(validationResult.data.incidentDate),
        validationResult.data.incidentDetails
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
        message: "Incident updated successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}
