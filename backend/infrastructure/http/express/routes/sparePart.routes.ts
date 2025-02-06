import { Router } from "express";
import { SparePartController } from "../controllers/sparePart.controller";
export const sparePartRoutes = () => {
  const router = Router();
  const controller = new SparePartController();

  router.post("/spare-parts", controller.createSparePart);
  router.get("/spare-parts", controller.getAllSpareParts);
  router.get("/spare-parts/low-stock", controller.getLowStock);
  router.get("/spare-parts/search", controller.searchByName);
  router.get("/spare-parts/:id", controller.getSparePartById);
  router.patch("/spare-parts/:id/stock", controller.updateStock);

  return router;
};
