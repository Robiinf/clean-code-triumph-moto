import { Router } from "express";
import { MaintenanceController } from "../controllers/maintenance.controller";

export const maintenanceRoutes = () => {
  const router = Router();
  const controller = new MaintenanceController();

  router.post("/maintenances", controller.createMaintenance);
  router.put("/maintenances/:id", controller.updateMaintenance);
  router.put(
    "/maintenances/:id/replaced-parts",
    controller.updateMaintenanceSpareParts
  );
  router.get("/maintenances", controller.getMaintenances);
  router.get(
    "/motorcycles/:motorcycleId/maintenances",
    controller.getMaintenancesByMotorcycle
  );
  router.get(
    "/breakdowns/:breakdownId/maintenance",
    controller.getMaintenanceByBreakdown
  );

  return router;
};
