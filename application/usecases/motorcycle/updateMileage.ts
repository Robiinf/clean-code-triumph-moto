import { MotorcycleEntity } from "../../../domain/entities/MotorcycleEntity";
import { NegativeMileage } from "../../../domain/errors/NegativeMileage";
import { Mileage } from "../../../domain/types/mileage";
import { MotorcycleRepository } from "../../repositories/MotorcycleRepository";

export class RegisterMotorcycle {
  constructor(private motorcycleRepository: MotorcycleRepository) {}

  async execute(
    motorcycle: MotorcycleEntity,
    mileage: number
  ): Promise<void | NegativeMileage> {
    const checkedMileage = Mileage.from(mileage);

    if (checkedMileage instanceof Error) {
      return checkedMileage;
    }

    await this.motorcycleRepository.updateMileage(
      motorcycle.id,
      checkedMileage
    );
  }
}
