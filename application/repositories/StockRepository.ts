import { StockEntity } from "../../domain/entities/StockEntity";
import { StockQuantity } from "../../domain/types/stock";

export interface StockRepository {
  addStock(sparePartId: string, quantity: StockQuantity): Promise<StockEntity>;
  removeStock(
    sparePartId: string,
    quantity: StockQuantity
  ): Promise<StockEntity>;
}
