import { OrderEntity } from "../../../domain/entities/OrderEntity";
import { OrderRepository } from "../../repositories/OrderRepository";
import { SparePartRepository } from "../../repositories/SparePartRepository";
import { SparePartNotFound } from "../../../domain/errors/SparePartNotFound";

export class CreateOrder {
  constructor(
    private orderRepository: OrderRepository,
    private sparePartRepository: SparePartRepository
  ) {}

  public async execute(
    orderDate: Date,
    sparePartId: string,
    quantity: number,
    unitPrice: number,
    deliveryDate?: Date
  ) {
    const sparePart = await this.sparePartRepository.findById(sparePartId);
    if (!sparePart) {
      return new SparePartNotFound();
    }

    const order = OrderEntity.create(
      orderDate,
      sparePartId,
      quantity,
      unitPrice,
      deliveryDate
    );

    if (order instanceof Error) {
      return order;
    }

    await this.orderRepository.save(order);
  }
}
