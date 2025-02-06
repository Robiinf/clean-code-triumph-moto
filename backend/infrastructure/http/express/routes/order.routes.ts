import { Router } from "express";
import { OrderController } from "../controllers/order.controller";

export const orderRoutes = () => {
  const router = Router();
  const controller = new OrderController();

  router.post("/orders", controller.createOrder);
  router.get("/orders", controller.getAllOrders);
  router.get("/orders/status/:status", controller.getOrdersByStatus);
  router.get("/orders/:id", controller.getOrder);
  router.patch("/orders/:id/status", controller.updateOrderStatus);

  return router;
};
