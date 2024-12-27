import { SparePart } from "../../../domain/entities/SparePart";
import { StockQuantity } from "../../../domain/value-object/stock";
import { StockRepository } from "../../repositories/StockRepository";

export class addStock {
  constructor(private stockRepository: StockRepository) {}

  async execute(
    sparePart: SparePart,
    quantityToAdd: StockQuantity
  ): Promise<void> {
    await this.stockRepository.addStock(sparePart.id, quantityToAdd);
  }
}
