import { SparePartEntity } from "../../../domain/entities/SparePartEntity";
import { SparePartRepository } from "../../repositories/SparePartRepository";

export class createSparePart {
  constructor(private sparePartRepository: SparePartRepository) {}

  async execute(sparePart: SparePartEntity): Promise<void> {
    await this.sparePartRepository.createSparePart(sparePart);
  }
}
