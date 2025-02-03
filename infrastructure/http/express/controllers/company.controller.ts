// src/infrastructure/http/express/controllers/company.controller.ts
import { Request, Response, NextFunction } from "express";
import { RepositoryFactory } from "../../../config/RepositoryFactory";
import { CompanyRepository } from "../../../../application/repositories/CompanyRepository";
import { CreateCompany } from "../../../../application/usecases/company/CreateCompany";
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
          message: result.message,
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
}
