import crypto from "crypto";
import { OrderLineEntity } from "./OrderLineEntity";

export type OrderStatus = "pending" | "confirmed" | "delivered" | "cancelled";

export class OrderEntity {
  private constructor(
    public id: string,
    public orderDate: Date,
    public status: OrderStatus,
    public totalAmount: number,
    public orderLines: OrderLineEntity[]
  ) {}

  public static create(orderLines: OrderLineEntity[]): OrderEntity {
    const id = crypto.randomUUID();
    const orderDate = new Date();
    const status: OrderStatus = "pending";
    const totalAmount = orderLines.reduce(
      (sum, line) => sum + line.unitPrice * line.quantity,
      0
    );

    return new OrderEntity(id, orderDate, status, totalAmount, orderLines);
  }

  public static restore(
    id: string,
    orderDate: Date,
    status: OrderStatus,
    totalAmount: number,
    orderLines: OrderLineEntity[]
  ): OrderEntity {
    return new OrderEntity(id, orderDate, status, totalAmount, orderLines);
  }

  public updateStatus(newStatus: OrderStatus): OrderEntity {
    return new OrderEntity(
      this.id,
      this.orderDate,
      newStatus,
      this.totalAmount,
      this.orderLines
    );
  }
}
