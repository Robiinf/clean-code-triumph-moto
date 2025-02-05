import { SparePartEntity } from "../../../domain/entities/SparePartEntity";
import { SparePartRepository } from "../../repositories/SparePartRepository";

export class GetLowStockSpareParts {
  constructor(private sparePartRepository: SparePartRepository) {}

  async execute(): Promise<SparePartEntity[]> {
    return this.sparePartRepository.findLowStock();
  }
}
