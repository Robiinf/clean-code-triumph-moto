import { SparePartRepository } from "../../repositories/SparePartRepository";
import { SparePartNotFound } from "../../../domain/errors/SparePartNotFound";
import { NegativeStockError } from "../../../domain/errors/NegativeStockError";
import { NegativeUnitPriceError } from "../../../domain/errors/NegativeUnitPriceError";

export class EditSparePart {
  constructor(private sparePartRepository: SparePartRepository) {}

  async execute(
    id: string,
    name: string,
    description: string,
    unitPrice: number,
    stockQuantity: number,
    alertLowStock: number
  ): Promise<void | Error> {
    const sparePart = await this.sparePartRepository.findById(id);
    if (!sparePart) {
      return new SparePartNotFound();
    }

    if (stockQuantity < 0) {
      return new NegativeStockError();
    }

    if (alertLowStock > stockQuantity) {
      // TODO : Implement the logic to notify the user when the stock is low
    }

    if (unitPrice < 0) {
      return new NegativeUnitPriceError();
    }

    await this.sparePartRepository.edit(
      id,
      name,
      description,
      unitPrice,
      stockQuantity,
      alertLowStock
    );
  }
}
