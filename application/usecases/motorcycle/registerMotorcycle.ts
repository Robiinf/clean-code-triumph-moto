import { Motorcycle } from "../../../domain/entities/Motorcycle";
import { MotorcycleRepository } from "../../repositories/MotorcycleRepository";

export class RegisterMotorcycle {
  constructor(private motorcycleRepository: MotorcycleRepository) {}

  async execute(motorcycle: Motorcycle): Promise<void> {
    await this.motorcycleRepository.registerMotorcycle(motorcycle);
  }
}
