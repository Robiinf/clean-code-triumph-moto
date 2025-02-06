// src/infrastructure/http/express/controllers/rental.controller.ts
import { Request, Response, NextFunction } from "express";
import { RepositoryFactory } from "../../../config/RepositoryFactory";
import { RentalRepository } from "../../../../application/repositories/RentalRepository";
import { MotorcycleRepository } from "../../../../application/repositories/MotorcycleRepository";
import { DriverRepository } from "../../../../application/repositories/DriverRepository";
import { CreateRentalReport } from "../../../../application/usecases/rental/CreateRentalReport";
import { GetRentalById } from "../../../../application/usecases/rental/GetRentalById";
import { ListAllRentals } from "../../../../application/usecases/rental/ListAllRentals";
import { ListRentalsByDriver } from "../../../../application/usecases/rental/ListRentalsByDriver";
import { ListRentalsByMotorcycle } from "../../../../application/usecases/rental/ListRentalsByMotorcycle";
import { ZodRentalValidator } from "../../validation/implementations/zod/ZodRentalValidator";
import { UpdateRentalReturn } from "../../../../application/usecases/rental/UpdateRentalReturn";

export class RentalController {
  private rentalRepository: RentalRepository;
  private motorcycleRepository: MotorcycleRepository;
  private driverRepository: DriverRepository;
  private validator: ZodRentalValidator;

  constructor() {
    const repositoryFactory = RepositoryFactory.getInstance();
    this.rentalRepository =
      repositoryFactory.getRepository<RentalRepository>("RentalEntity");
    this.motorcycleRepository =
      repositoryFactory.getRepository<MotorcycleRepository>("MotorcycleEntity");
    this.driverRepository =
      repositoryFactory.getRepository<DriverRepository>("DriverEntity");
    this.validator = new ZodRentalValidator();
  }

  createRental = async (
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

      const createRentalUseCase = new CreateRentalReport(
        this.rentalRepository,
        this.motorcycleRepository,
        this.driverRepository
      );
      const result = await createRentalUseCase.execute(
        validationResult.data.motorcycleId,
        validationResult.data.renterId,
        new Date(validationResult.data.rentalStartDate),
        new Date(validationResult.data.rentalEndDate),
        validationResult.data.dailyRate,
        validationResult.data.returnDate
          ? new Date(validationResult.data.returnDate)
          : null
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

  getAllRentals = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const listRentalsUseCase = new ListAllRentals(this.rentalRepository);
      const rentals = await listRentalsUseCase.execute();

      res.status(200).json({
        status: "success",
        data: rentals,
      });
    } catch (error) {
      next(error);
    }
  };

  getRentalsByDriver = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { driverId } = req.params;

      const listRentalsByDriverUseCase = new ListRentalsByDriver(
        this.rentalRepository
      );
      const rentals = await listRentalsByDriverUseCase.execute(driverId);

      res.status(200).json({
        status: "success",
        data: rentals,
      });
    } catch (error) {
      next(error);
    }
  };

  getRentalsByMotorcycle = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { motorcycleId } = req.params;

      const listRentalsByMotorcycleUseCase = new ListRentalsByMotorcycle(
        this.rentalRepository
      );
      const rentals = await listRentalsByMotorcycleUseCase.execute(
        motorcycleId
      );

      res.status(200).json({
        status: "success",
        data: rentals,
      });
    } catch (error) {
      next(error);
    }
  };

  getRentalById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { rentalId } = req.params;

      const getRentalByIdUseCase = new GetRentalById(this.rentalRepository);
      const rental = await getRentalByIdUseCase.execute(rentalId);

      if (!rental) {
        res.status(404).json({
          status: "error",
          message: "Rental not found",
        });
        return;
      }

      res.status(200).json({
        status: "success",
        data: rental,
      });
    } catch (error) {
      next(error);
    }
  };

  updateRentalReturn = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { rentalId } = req.params;
      const { returnDate } = req.body;

      const updateRentalReturnUseCase = new UpdateRentalReturn(
        this.rentalRepository
      );
      const result = await updateRentalReturnUseCase.execute(
        rentalId,
        new Date(returnDate)
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
}
