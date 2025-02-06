import { MotorcycleRepository } from "../../repositories/MotorcycleRepository";
import { MotorcycleEntity } from "../../../domain/entities/MotorcycleEntity";
import { VehicleNotFound } from "../../../domain/errors/VehicleNotFound";

export class GetMotorcycleById {
  constructor(private motorcycleRepository: MotorcycleRepository) {}

  async execute(id: string): Promise<MotorcycleEntity | VehicleNotFound> {
    const motorcycle = await this.motorcycleRepository.findById(id);

    if (!motorcycle) {
      return new VehicleNotFound();
    }

    return motorcycle;
  }
}
