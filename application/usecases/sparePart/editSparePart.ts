import { SparePartEntity } from "../../../domain/entities/SparePartEntity";
import { SparePartRepository } from "../../repositories/SparePartRepository";

export class EditSparePart {
  constructor(private sparePartRepository: SparePartRepository) {}

  async execute(sparePart: SparePartEntity): Promise<void> {
    await this.sparePartRepository.editSparePart(sparePart);
  }
}
