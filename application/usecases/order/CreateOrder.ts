import { OrderEntity } from "../../../domain/entities/OrderEntity";
import { OrderRepository } from "../../repositories/OrderRepository";
import { SparePartRepository } from "../../repositories/SparePartRepository";
import { SparePartNotFound } from "../../../domain/errors/SparePartNotFound";
import { NegativeOrderQuantityError } from "../../../domain/errors/NegativeOrderQuantityError";
import { NegativeUnitPriceError } from "../../../domain/errors/NegativeUnitPriceError";
import { DeliveryDateBeforeOrderDateError } from "../../../domain/errors/DeliveryDateBeforeOrderDateError";

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

    if (deliveryDate && deliveryDate < orderDate) {
      return new DeliveryDateBeforeOrderDateError();
    }

    if (quantity <= 0) {
      return new NegativeOrderQuantityError();
    }

    if (unitPrice <= 0) {
      return new NegativeUnitPriceError();
    }

    const order = OrderEntity.create(
      orderDate,
      sparePartId,
      quantity,
      unitPrice,
      deliveryDate
    );

    await this.orderRepository.save(order);
  }
}
