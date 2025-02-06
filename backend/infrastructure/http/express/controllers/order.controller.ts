// src/infrastructure/http/express/controllers/order.controller.ts
import { Request, Response, NextFunction } from "express";
import { RepositoryFactory } from "../../../config/RepositoryFactory";
import { OrderRepository } from "../../../../application/repositories/OrderRepository";
import { SparePartRepository } from "../../../../application/repositories/SparePartRepository";
import { CreateOrder } from "../../../../application/usecases/order/CreateOrder";
import { GetOrderById } from "../../../../application/usecases/order/GetOrderById";
import { GetAllOrders } from "../../../../application/usecases/order/GetAllOrders";
import { GetOrdersByStatus } from "../../../../application/usecases/order/GetOrdersByStatus";
import { UpdateOrderStatus } from "../../../../application/usecases/order/UpdateOrderStatus";
import { ZodOrderValidator } from "../../validation/implementations/zod/ZodOrderValidator";
import { OrderStatus } from "../../../../domain/entities/OrderEntity";

export class OrderController {
  private orderRepository: OrderRepository;
  private sparePartRepository: SparePartRepository;
  private validator: ZodOrderValidator;

  constructor() {
    const repositoryFactory = RepositoryFactory.getInstance();
    this.orderRepository =
      repositoryFactory.getRepository<OrderRepository>("OrderEntity");
    this.sparePartRepository =
      repositoryFactory.getRepository<SparePartRepository>("SparePartEntity");
    this.validator = new ZodOrderValidator();
  }

  createOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const validationResult = await this.validator.validate(req.body);

      if (!validationResult.success) {
        res.status(400).json({
          status: "error",
          errors: validationResult.errors,
        });
        return;
      }

      const createOrderUseCase = new CreateOrder(
        this.orderRepository,
        this.sparePartRepository
      );

      const result = await createOrderUseCase.execute(
        validationResult.data.orderLines
      );

      if (result instanceof Error) {
        res.status(400).json({
          status: "error",
          message: result.name,
        });
        return;
      }

      res.status(201).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const getOrderUseCase = new GetOrderById(this.orderRepository);
      const result = await getOrderUseCase.execute(id);

      if (result instanceof Error) {
        res.status(404).json({
          status: "error",
          message: result.name,
        });
        return;
      }

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getAllOrders = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const getAllOrdersUseCase = new GetAllOrders(this.orderRepository);
      const orders = await getAllOrdersUseCase.execute();

      res.status(200).json({
        status: "success",
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  };

  getOrdersByStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { status } = req.params as { status: OrderStatus };

      if (
        !["pending", "confirmed", "delivered", "cancelled"].includes(status)
      ) {
        res.status(400).json({
          status: "error",
          message: "Invalid status",
        });
        return;
      }

      const getOrdersByStatusUseCase = new GetOrdersByStatus(
        this.orderRepository
      );
      const orders = await getOrdersByStatusUseCase.execute(status);

      res.status(200).json({
        status: "success",
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  };

  updateOrderStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (
        !status ||
        !["pending", "confirmed", "delivered", "cancelled"].includes(status)
      ) {
        res.status(400).json({
          status: "error",
          message: "Invalid status",
        });
        return;
      }

      const updateStatusUseCase = new UpdateOrderStatus(this.orderRepository);
      const result = await updateStatusUseCase.execute(
        id,
        status as OrderStatus
      );

      if (result instanceof Error) {
        res.status(400).json({
          status: "error",
          message: result.name,
        });
        return;
      }

      res.status(200).json({
        status: "success",
        message: "Order status updated successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}
