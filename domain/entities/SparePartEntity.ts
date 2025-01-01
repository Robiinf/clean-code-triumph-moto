export class SparePartEntity {
  constructor(
    public id: string,
    public name: string,
    public unit_price: number,
    public description: string
  ) {}

  public static create(
    name: string,
    unit_price: number,
    description: string
  ): SparePartEntity {
    const id = crypto.randomUUID();
    return new SparePartEntity(id, name, unit_price, description);
  }
}
