import { SparePartEntity } from "../../../domain/entities/SparePartEntity";
import { SparePartRepository } from "../../repositories/SparePartRepository";
import { SparePartNotFound } from "../../../domain/errors/SparePartNotFound";

export class GetSparePartById {
  constructor(private sparePartRepository: SparePartRepository) {}

  async execute(id: string): Promise<SparePartEntity | SparePartNotFound> {
    const sparePart = await this.sparePartRepository.findById(id);
    if (!sparePart) {
      return new SparePartNotFound();
    }
    return sparePart;
  }
}
