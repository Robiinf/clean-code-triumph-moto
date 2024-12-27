import { SparePart } from "../../../domain/entities/SparePart";
import { StockQuantity } from "../../../domain/value-object/stock";
import { StockRepository } from "../../repositories/StockRepository";

export class removeStock {
  constructor(private stockRepository: StockRepository) {}

  async execute(
    sparePart: SparePart,
    quantityToRemove: StockQuantity
  ): Promise<void> {
    await this.stockRepository.addStock(sparePart.id, quantityToRemove);
  }
}
