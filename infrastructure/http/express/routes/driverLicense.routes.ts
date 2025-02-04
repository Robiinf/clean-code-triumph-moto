import { Router } from "express";
import { DriverLicenseController } from "../controllers/driverLicense.controller";

export const driverLicenseRoutes = () => {
  const router = Router();
  const controller = new DriverLicenseController();

  router.post("/driver-licenses", controller.createDriverLicense);
  router.get("/driver-licenses/:id", controller.getDriverLicense);
  router.put("/driver-licenses/:id", controller.editDriverLicense);
  router.delete("/driver-licenses/:id", controller.deleteDriverLicense);

  return router;
};
