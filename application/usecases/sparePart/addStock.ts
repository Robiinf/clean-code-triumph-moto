import { SparePartEntity } from "../../../domain/entities/SparePartEntity";
import { StockQuantity } from "../../../domain/types/stock";
import { StockRepository } from "../../repositories/StockRepository";

export class addStock {
  constructor(private stockRepository: StockRepository) {}

  async execute(
    sparePart: SparePartEntity,
    quantityToAdd: StockQuantity
  ): Promise<void> {
    await this.stockRepository.addStock(sparePart.id, quantityToAdd);
  }
}
