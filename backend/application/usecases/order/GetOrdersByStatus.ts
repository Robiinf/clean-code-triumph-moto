import { OrderRepository } from "../../repositories/OrderRepository";
import { OrderEntity, OrderStatus } from "../../../domain/entities/OrderEntity";

export class GetOrdersByStatus {
  constructor(private orderRepository: OrderRepository) {}

  async execute(status: OrderStatus): Promise<OrderEntity[]> {
    return this.orderRepository.findByStatus(status);
  }
}
