// src/infrastructure/http/express/controllers/company.controller.ts
import { Request, Response, NextFunction } from "express";
import { RepositoryFactory } from "../../../config/RepositoryFactory";
import { CompanyRepository } from "../../../../application/repositories/CompanyRepository";
import { CreateCompany } from "../../../../application/usecases/company/CreateCompany";
import { ListAllCompany } from "../../../../application/usecases/company/ListAllCompany";
import { GetCompanyById } from "../../../../application/usecases/company/GetCompanyById";
import { DeleteCompany } from "../../../../application/usecases/company/DeleteCompany";
import { EditCompany } from "../../../../application/usecases/company/EditCompany";
import { ZodCompanyValidator } from "../../validation/implementations/zod/ZodCompanyValidator";

export class CompanyController {
  private repository: CompanyRepository;
  private validator: ZodCompanyValidator;

  constructor() {
    const repositoryFactory = RepositoryFactory.getInstance();
    this.repository =
      repositoryFactory.getRepository<CompanyRepository>("CompanyEntity");
    this.validator = new ZodCompanyValidator();
  }

  createCompany = async (
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

      const createCompanyUseCase = new CreateCompany(this.repository);

      const result = await createCompanyUseCase.execute(
        validationResult.data.name,
        validationResult.data.siret,
        validationResult.data.phone,
        validationResult.data.address,
        validationResult.data.city,
        validationResult.data.postalCode,
        validationResult.data.country
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
        message: "Company created successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  listAllCompany = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const listAllCompanyUseCase = new ListAllCompany(this.repository);

      const result = await listAllCompanyUseCase.execute();

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getCompanyById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const getCompanyByIdUseCase = new GetCompanyById(this.repository);
      const result = await getCompanyByIdUseCase.execute(id);

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

  deleteCompany = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const deleteCompanyUseCase = new DeleteCompany(this.repository);
      const result = await deleteCompanyUseCase.execute(id);

      if (result instanceof Error) {
        res.status(404).json({
          status: "error",
          message: result.name,
        });
        return;
      }

      res.status(204).json({
        status: "success",
        message: "Company deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  editCompany = async (req: Request, res: Response, next: NextFunction) => {
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

      const editCompanyUseCase = new EditCompany(this.repository);

      const result = await editCompanyUseCase.execute(
        id,
        validationResult.data.name,
        validationResult.data.siret,
        validationResult.data.phone,
        validationResult.data.address,
        validationResult.data.city,
        validationResult.data.postalCode,
        validationResult.data.country
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
        message: "Company updated successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}
