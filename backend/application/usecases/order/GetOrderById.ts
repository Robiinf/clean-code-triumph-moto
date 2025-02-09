import { OrderRepository } from "../../repositories/OrderRepository";
import { OrderEntity } from "../../../domain/entities/OrderEntity";
import { OrderNotFoundError } from "../../../domain/errors/OrderNotFoundError";

export class GetOrderById {
  constructor(private orderRepository: OrderRepository) {}

  async execute(id: string): Promise<OrderEntity | Error> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      return new OrderNotFoundError();
    }
    return order;
  }
}
