import crypto from "crypto";

export class OrderLineEntity {
  private constructor(
    public id: string,
    public orderId: string,
    public sparePartId: string,
    public quantity: number,
    public unitPrice: number
  ) {}

  public static create(
    orderId: string,
    sparePartId: string,
    quantity: number,
    unitPrice: number
  ): OrderLineEntity {
    const id = crypto.randomUUID();
    return new OrderLineEntity(id, orderId, sparePartId, quantity, unitPrice);
  }
}
