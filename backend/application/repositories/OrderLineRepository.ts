import { OrderLineEntity } from "../../domain/entities/OrderLineEntity";

export interface OrderLineRepository {
  save(orderLine: OrderLineEntity): Promise<void>;
  findByOrder(orderId: string): Promise<OrderLineEntity[]>;
  findBySparePart(sparePartId: string): Promise<OrderLineEntity[]>;
}
