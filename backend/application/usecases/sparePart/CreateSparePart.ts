import { SparePartRepository } from "../../repositories/SparePartRepository";
import { SparePartEntity } from "../../../domain/entities/SparePartEntity";
import { NegativeStockError } from "../../../domain/errors/NegativeStockError";
import { NegativeUnitPriceError } from "../../../domain/errors/NegativeUnitPriceError";

export class CreateSparePart {
  constructor(private sparePartRepository: SparePartRepository) {}

  async execute(
    name: string,
    unitPrice: number,
    description: string,
    stockQuantity: number,
    alertLowStock: number
  ): Promise<void | NegativeStockError | NegativeUnitPriceError> {
    if (stockQuantity < 0) {
      return new NegativeStockError();
    }

    if (unitPrice < 0) {
      return new NegativeUnitPriceError();
    }

    const sparePart = SparePartEntity.create(
      name,
      unitPrice,
      description,
      stockQuantity,
      alertLowStock
    );

    await this.sparePartRepository.save(sparePart);
  }
}
