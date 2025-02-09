import { Request, Response, NextFunction } from "express";
import { RepositoryFactory } from "../../../config/RepositoryFactory";
import { SparePartRepository } from "../../../../application/repositories/SparePartRepository";
import { CreateSparePart } from "../../../../application/usecases/sparePart/CreateSparePart";
import { GetAllSpareParts } from "../../../../application/usecases/sparePart/GetAllSpareParts";
import { GetSparePartById } from "../../../../application/usecases/sparePart/GetSparePartById";
import { UpdateSparePartStock } from "../../../../application/usecases/sparePart/UpdateSparePartStock";
import { GetLowStockSpareParts } from "../../../../application/usecases/sparePart/GetLowStockSpareParts";
import { SearchSparePartsByName } from "../../../../application/usecases/sparePart/SearchSparePartsByName";
import { ZodSparePartValidator } from "../../validation/implementations/zod/ZodSparePartValidator";
import { EditSparePart } from "../../../../application/usecases/sparePart/EditSparePart";

export class SparePartController {
  private sparePartRepository: SparePartRepository;
  private validator: ZodSparePartValidator;

  constructor() {
    const repositoryFactory = RepositoryFactory.getInstance();
    this.sparePartRepository =
      repositoryFactory.getRepository<SparePartRepository>("SparePartEntity");
    this.validator = new ZodSparePartValidator();
  }

  createSparePart = async (
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

      const createSparePartUseCase = new CreateSparePart(
        this.sparePartRepository
      );
      const result = await createSparePartUseCase.execute(
        validationResult.data.name,
        validationResult.data.unitPrice,
        validationResult.data.description,
        validationResult.data.stockQuantity,
        validationResult.data.alertLowStock
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

  getAllSpareParts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const getAllPartsUseCase = new GetAllSpareParts(this.sparePartRepository);
      const parts = await getAllPartsUseCase.execute();

      res.status(200).json({
        status: "success",
        data: parts,
      });
    } catch (error) {
      next(error);
    }
  };

  getSparePartById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const getPartUseCase = new GetSparePartById(this.sparePartRepository);
      const result = await getPartUseCase.execute(id);

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

  editStock = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const { quantity } = req.body;

      const updateStockUseCase = new UpdateSparePartStock(
        this.sparePartRepository
      );
      const result = await updateStockUseCase.execute(id, quantity);

      if (result instanceof Error) {
        res.status(400).json({
          status: "error",
          message: result.name,
        });
        return;
      }

      res.status(200).json({
        status: "success",
        message: "Stock updated successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  editSparePart = async (
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

      const editSparePartUseCase = new EditSparePart(this.sparePartRepository);
      const result = await editSparePartUseCase.execute(
        id,
        validationResult.data.name,
        validationResult.data.description,
        validationResult.data.unitPrice,
        validationResult.data.stockQuantity,
        validationResult.data.alertLowStock
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
        message: "Spare Part updated successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  getLowStock = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const getLowStockUseCase = new GetLowStockSpareParts(
        this.sparePartRepository
      );
      const parts = await getLowStockUseCase.execute();

      res.status(200).json({
        status: "success",
        data: parts,
      });
    } catch (error) {
      next(error);
    }
  };

  searchByName = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { name } = req.query;
      const searchUseCase = new SearchSparePartsByName(
        this.sparePartRepository
      );
      const parts = await searchUseCase.execute(name as string);

      res.status(200).json({
        status: "success",
        data: parts,
      });
    } catch (error) {
      next(error);
    }
  };
}
