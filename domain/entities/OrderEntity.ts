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
  ): OrderEntity {
    const id = crypto.randomUUID();
    const orderStatus = "PENDING";
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
