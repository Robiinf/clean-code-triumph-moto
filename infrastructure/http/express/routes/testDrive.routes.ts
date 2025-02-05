import { Router } from "express";
import { TestDriveController } from "../controllers/testDrive.controller";

export const testDriveRoutes = () => {
  const router = Router();
  const controller = new TestDriveController();

  router.post("/test-drives", controller.createTestDrive);
  router.get("/driver/:driverId/test-drives", controller.listTestDriveByDriver);
  router.get(
    "/motorcycle/:motorcycleId/test-drives",
    controller.listTestDriveByVehicule
  );
  return router;
};
