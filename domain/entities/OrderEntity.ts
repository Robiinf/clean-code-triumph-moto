import { NegativeOrderQuantityError } from "../errors/NegativeOrderQuantityError";
import { NegativeUnitPriceError } from "../errors/NegativeUnitPriceError";
import { DeliveryDateBeforeOrderDateError } from "../errors/DeliveryDateBeforeOrderDateError";

export class OrderEntity {
  constructor(
    public id: string,
    public orderDate: Date,
    public orderStatus: string,
    public sparePartId: string,
    public quantity: number,
    public unitPrice: number,
    public deliveryDate?: Date
  ) {}

  public static create(
    orderDate: Date,
    sparePartId: string,
    quantity: number,
    unitPrice: number,
    deliveryDate?: Date
  ):
    | OrderEntity
    | NegativeOrderQuantityError
    | NegativeUnitPriceError
    | DeliveryDateBeforeOrderDateError {
    const id = crypto.randomUUID();
    const orderStatus = "PENDING";

    if (deliveryDate && deliveryDate < orderDate) {
      return new DeliveryDateBeforeOrderDateError();
    }

    if (quantity <= 0) {
      return new NegativeOrderQuantityError();
    }

    if (unitPrice <= 0) {
      return new NegativeUnitPriceError();
    }

    return new OrderEntity(
      id,
      orderDate,
      orderStatus,
      sparePartId,
      quantity,
      unitPrice,
      deliveryDate
    );
  }
}
