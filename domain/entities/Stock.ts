import { StockQuantity } from "../value-object/stock";

export class Stock {
  constructor(
    public id: string,
    public quantity: StockQuantity,
    public spare_part_id: string,
    public alert_level: StockQuantity
  ) {}
}
