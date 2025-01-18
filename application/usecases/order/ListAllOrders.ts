import { OrderRepository } from "../../repositories/OrderRepository";
import { OrderEntity } from "../../../domain/entities/OrderEntity";

export class ListAllOrders {
  constructor(private orderRepository: OrderRepository) {}

  public async execute(): Promise<OrderEntity[]> {
    return this.orderRepository.findAll();
  }
}
