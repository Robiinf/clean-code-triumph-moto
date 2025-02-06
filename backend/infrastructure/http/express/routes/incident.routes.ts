import { Router } from "express";
import { IncidentController } from "../controllers/incident.controller";

export const incidentRoutes = () => {
  const router = Router();
  const controller = new IncidentController();

  router.post("/incidents", controller.createIncident);
  router.get("/incidents/:id", controller.getIncidentById);
  router.get("/drivers/:driverId/incidents", controller.getIncidentsByDriver);
  router.get(
    "/motorcycles/:motorcycleId/incidents",
    controller.getIncidentsByMotorcycle
  );
  router.put("/incidents/:id", controller.editIncident);

  return router;
};
