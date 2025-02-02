import { MotorcycleRepository } from "../../repositories/MotorcycleRepository";

export class RemoveMotorcycle {
  constructor(private motorcycleRepository: MotorcycleRepository) {}

  async execute(id: string): Promise<void> {
    await this.motorcycleRepository.delete(id);
  }
}
