// src/infrastructure/http/express/routes/driver.routes.ts
import { Router } from "express";
import { DriverController } from "../controllers/driver.controller";

export const driverRoutes = () => {
  const router = Router();
  const controller = new DriverController();

  router.post("/drivers", controller.createDriver);
  router.get(
    "/companies/:companyId/drivers",
    controller.getAllDriversByCompany
  );
  router.put("/drivers/:id", controller.editDriver);
  router.delete("/drivers/:id", controller.deleteDriver);

  return router;
};
