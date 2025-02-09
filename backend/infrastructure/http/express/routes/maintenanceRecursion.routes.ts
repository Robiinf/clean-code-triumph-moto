import { Router } from "express";
import { MaintenanceRecursionController } from "../controllers/maintenanceRecursion.controller";

export const maintenanceRecursionRoutes = () => {
  const router = Router();
  const controller = new MaintenanceRecursionController();

  router.post("/maintenance-recursions", controller.createMaintenanceRecursion);
  router.get(
    "/motorcycles/:motorcycleId/maintenance-recursions",
    controller.getMaintenancesRecursionByMotorcycle
  );
  router.put(
    "/maintenance-recursions/:id",
    controller.updateMaintenanceRecursion
  );
  router.delete(
    "/maintenance-recursions/:id",
    controller.deleteMaintenanceRecursion
  );
  return router;
};
