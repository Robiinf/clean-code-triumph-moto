import { Router } from "express";
import { WarrantyController } from "../controllers/warranty.controller";

export const warrantyRoutes = () => {
  const router = Router();
  const controller = new WarrantyController();

  router.post("/warranties", controller.createWarranty);
  router.get(
    "/motorcycles/:vehicleId/warranties",
    controller.getWarrantiesByVehicle
  );
  router.get("/warranties/:id", controller.getWarrantyById);
  router.patch("/warranties/:id/status", controller.updateWarrantyStatus);
  router.patch("/warranties/:id/extend", controller.extendWarranty);

  return router;
};
