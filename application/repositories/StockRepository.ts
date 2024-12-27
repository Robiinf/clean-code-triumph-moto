import { Stock } from "../../domain/entities/Stock";
import { StockQuantity } from "../../domain/types/stock";

export interface StockRepository {
  addStock(sparePartId: string, quantity: StockQuantity): Promise<Stock>;
  removeStock(sparePartId: string, quantity: StockQuantity): Promise<Stock>;
}
