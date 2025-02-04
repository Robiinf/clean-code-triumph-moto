import { Router } from "express";
import { TestDriveController } from "../controllers/testDrive.controller";

export const testDriveRoutes = () => {
  const router = Router();
  const controller = new TestDriveController();

  router.post("/testDrives", controller.createTestDrive);
  router.get("/driver/:driverId/testDrives", controller.listTestDriveByDriver);
  router.get(
    "/motorcycle/:motorcycleId/testDrives",
    controller.listTestDriveByVehicule
  );
  return router;
};
