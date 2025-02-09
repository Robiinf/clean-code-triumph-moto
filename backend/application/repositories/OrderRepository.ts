import { OrderEntity } from "../../domain/entities/OrderEntity";
import { OrderStatus } from "../../domain/entities/OrderEntity";
export interface OrderRepository {
  save(order: OrderEntity): Promise<void>;
  findById(id: string): Promise<OrderEntity | null>;
  findAll(): Promise<OrderEntity[]>;
  findByStatus(status: OrderStatus): Promise<OrderEntity[]>;
  updateStatus(id: string, status: OrderStatus): Promise<void>;
}
