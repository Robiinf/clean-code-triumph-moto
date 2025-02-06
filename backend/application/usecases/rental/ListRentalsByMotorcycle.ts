import { RentalRepository } from "../../repositories/RentalRepository";

export class ListRentalsByMotorcycle {
  constructor(private readonly rentalRepository: RentalRepository) {}

  async execute(motorcycleId: string) {
    return await this.rentalRepository.findByMotorcycle(motorcycleId);
  }
}
