import { MotorcycleRepository } from "../../repositories/MotorcycleRepository";
import { MotorcycleEntity } from "../../../domain/entities/MotorcycleEntity";

export class ListAllMotorcycles {
  constructor(private motorcycleRepository: MotorcycleRepository) {}

  async execute(): Promise<MotorcycleEntity[]> {
    return this.motorcycleRepository.findAll();
  }
}
