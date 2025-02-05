import { OrderRepository } from "../../repositories/OrderRepository";
import { OrderStatus } from "../../../domain/entities/OrderEntity";
import { OrderNotFoundError } from "../../../domain/errors/OrderNotFoundError";

export class UpdateOrderStatus {
  constructor(private orderRepository: OrderRepository) {}

  async execute(
    orderId: string,
    newStatus: OrderStatus
  ): Promise<void | Error> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      return new OrderNotFoundError();
    }

    await this.orderRepository.updateStatus(orderId, newStatus);
  }
}
