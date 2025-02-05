import { SparePartEntity } from "../../../domain/entities/SparePartEntity";
import { SparePartRepository } from "../../repositories/SparePartRepository";

export class SearchSparePartsByName {
  constructor(private sparePartRepository: SparePartRepository) {}

  async execute(name: string): Promise<SparePartEntity[]> {
    return this.sparePartRepository.findByName(name);
  }
}
