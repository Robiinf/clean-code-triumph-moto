import { SparePartRepository } from "../../repositories/SparePartRepository";
import { SparePartNotFound } from "../../../domain/errors/SparePartNotFound";
import { NegativeStockError } from "../../../domain/errors/NegativeStockError";

export class UpdateSparePartStock {
  constructor(private sparePartRepository: SparePartRepository) {}

  async execute(id: string, newQuantity: number): Promise<void | Error> {
    const sparePart = await this.sparePartRepository.findById(id);
    if (!sparePart) {
      return new SparePartNotFound();
    }

    if (newQuantity < 0) {
      return new NegativeStockError();
    }

    // TODO : Implement the logic to notify the user when the stock is low

    await this.sparePartRepository.updateStockQuantity(id, newQuantity);
  }
}
