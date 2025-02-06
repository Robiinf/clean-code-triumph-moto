import { OrderRepository } from "../../repositories/OrderRepository";
import { SparePartRepository } from "../../repositories/SparePartRepository";
import { OrderEntity } from "../../../domain/entities/OrderEntity";
import { OrderLineEntity } from "../../../domain/entities/OrderLineEntity";
import { SparePartNotFound } from "../../../domain/errors/SparePartNotFound";
import { NegativeStockError } from "../../../domain/errors/NegativeStockError";

type OrderLineInput = {
  sparePartId: string;
  quantity: number;
};

export class CreateOrder {
  constructor(
    private orderRepository: OrderRepository,
    private sparePartRepository: SparePartRepository
  ) {}

  async execute(orderLines: OrderLineInput[]): Promise<OrderEntity | Error> {
    const orderLinesEntities: OrderLineEntity[] = [];

    for (const line of orderLines) {
      const sparePart = await this.sparePartRepository.findById(
        line.sparePartId
      );
      if (!sparePart) {
        return new SparePartNotFound();
      }
      if (sparePart.stockQuantity < line.quantity) {
        return new NegativeStockError();
      }

      const orderLine = OrderLineEntity.create(
        "",
        line.sparePartId,
        line.quantity,
        sparePart!.unitPrice
      );
      orderLinesEntities.push(orderLine);
    }

    const order = OrderEntity.create(orderLinesEntities);

    order.orderLines.forEach((line) => (line.orderId = order.id));

    await this.orderRepository.save(order);

    for (const line of orderLines) {
      const sparePart = await this.sparePartRepository.findById(
        line.sparePartId
      );
      await this.sparePartRepository.updateStockQuantity(
        line.sparePartId,
        sparePart!.stockQuantity - line.quantity
      );
    }

    return order;
  }
}
