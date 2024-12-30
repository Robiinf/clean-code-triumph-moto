import { StockQuantity } from "../types/stock";

export class StockEntity {
  constructor(
    public id: string,
    public quantity: StockQuantity,
    public spare_part_id: string,
    public alert_level: StockQuantity
  ) {}

  public static create(
    quantity: StockQuantity,
    spare_part_id: string,
    alert_level: StockQuantity
  ): StockEntity {
    const id = crypto.randomUUID();
    return new StockEntity(id, quantity, spare_part_id, alert_level);
  }
}
