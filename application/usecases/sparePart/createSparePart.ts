import { SparePart } from "../../../domain/entities/SparePart";
import { SparePartRepository } from "../../repositories/SparePartRepository";

export class createSparePart {
  constructor(private sparePartRepository: SparePartRepository) {}

  async execute(sparePart: SparePart): Promise<void> {
    await this.sparePartRepository.createSparePart(sparePart);
  }
}
