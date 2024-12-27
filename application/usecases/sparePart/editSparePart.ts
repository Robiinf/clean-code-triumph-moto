import { SparePart } from "../../../domain/entities/SparePart";
import { SparePartRepository } from "../../repositories/SparePartRepository";

export class EditSparePart {
  constructor(private sparePartRepository: SparePartRepository) {}

  async execute(sparePart: SparePart): Promise<void> {
    await this.sparePartRepository.editSparePart(sparePart);
  }
}
