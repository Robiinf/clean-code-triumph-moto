import { OrderRepository } from "../../repositories/OrderRepository";
import { OrderEntity } from "../../../domain/entities/OrderEntity";

export class GetAllOrders {
  constructor(private orderRepository: OrderRepository) {}

  async execute(): Promise<OrderEntity[]> {
    return this.orderRepository.findAll();
  }
}
