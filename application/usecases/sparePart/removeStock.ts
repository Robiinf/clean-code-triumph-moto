import { SparePartEntity } from "../../../domain/entities/SparePartEntity";
import { StockQuantity } from "../../../domain/types/stock";
import { StockRepository } from "../../repositories/StockRepository";

export class removeStock {
  constructor(private stockRepository: StockRepository) {}

  async execute(
    sparePart: SparePartEntity,
    quantityToRemove: StockQuantity
  ): Promise<void> {
    await this.stockRepository.addStock(sparePart.id, quantityToRemove);
  }
}
