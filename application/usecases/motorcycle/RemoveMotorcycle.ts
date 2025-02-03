import { MotorcycleRepository } from "../../repositories/MotorcycleRepository";
import { VehicleNotFound } from "../../../domain/errors/VehicleNotFound";

export class RemoveMotorcycle {
  constructor(private motorcycleRepository: MotorcycleRepository) {}

  async execute(id: string): Promise<void | VehicleNotFound> {
    const motorcycle = await this.motorcycleRepository.findById(id);

    if (!motorcycle) {
      return new VehicleNotFound();
    }

    await this.motorcycleRepository.delete(id);
  }
}
