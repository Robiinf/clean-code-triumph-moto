import { SparePartEntity } from "../../../domain/entities/SparePartEntity";
import { SparePartRepository } from "../../repositories/SparePartRepository";

export class GetAllSpareParts {
  constructor(private sparePartRepository: SparePartRepository) {}

  async execute(): Promise<SparePartEntity[]> {
    return this.sparePartRepository.findAll();
  }
}
