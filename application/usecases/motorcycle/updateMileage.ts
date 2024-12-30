import { MotorcycleEntity } from "../../../domain/entities/MotorcycleEntity";
import { MotorcycleRepository } from "../../repositories/MotorcycleRepository";

export class RegisterMotorcycle {
  constructor(private motorcycleRepository: MotorcycleRepository) {}

  async execute(motorcycle: MotorcycleEntity): Promise<void> {
    await this.motorcycleRepository.updateMileage(
      motorcycle.id,
      motorcycle.mileageInKilometers
    );
  }
}
