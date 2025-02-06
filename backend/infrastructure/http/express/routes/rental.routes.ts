import { Router } from "express";
import { RentalController } from "../controllers/rental.controller";

export const rentalRoutes = () => {
  const router = Router();
  const controller = new RentalController();

  router.post("/rentals", controller.createRental);
  router.get("/rentals", controller.getAllRentals);
  router.get("/rentals/:rentalId", controller.getRentalById);
  router.get("/drivers/:driverId/rentals", controller.getRentalsByDriver);
  router.get(
    "/motorcycles/:motorcycleId/rentals",
    controller.getRentalsByMotorcycle
  );
  router.put("/rentals/:rentalId/return", controller.updateRentalReturn);

  return router;
};
