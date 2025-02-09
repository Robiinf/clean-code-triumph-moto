import crypto from "crypto";
export class SparePartEntity {
  constructor(
    public id: string,
    public name: string,
    public unitPrice: number,
    public description: string,
    public stockQuantity: number,
    public alertLowStock: number
  ) {}

  public static create(
    name: string,
    unitPrice: number,
    description: string,
    stockQuantity: number,
    alertLowStock: number
  ): SparePartEntity {
    const id = crypto.randomUUID();
    return new SparePartEntity(
      id,
      name,
      unitPrice,
      description,
      stockQuantity,
      alertLowStock
    );
  }
}
