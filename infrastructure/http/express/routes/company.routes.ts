// src/infrastructure/http/express/routes/company.routes.ts
import { Router } from "express";
import { CompanyController } from "../controllers/company.controller";

export const companyRoutes = () => {
  const router = Router();
  const controller = new CompanyController();

  router.post("/companies", controller.createCompany);
  router.get("/companies", controller.listAllCompany);
  router.get("/companies/:id", controller.getCompanyById);
  router.delete("/companies/:id", controller.deleteCompany);
  router.put("/companies/:id", controller.editCompany);

  return router;
};
