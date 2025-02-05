import { Router } from "express";
import { BreakdownController } from "../controllers/breakdown.controller";

export const breakdownRoutes = () => {
  const router = Router();
  const controller = new BreakdownController();

  router.post("/breakdowns", controller.createBreakdown);
  router.get(
    "/motorcycles/:vehicleId/breakdowns",
    controller.getBreakdownsByVehicle
  );

  return router;
};
