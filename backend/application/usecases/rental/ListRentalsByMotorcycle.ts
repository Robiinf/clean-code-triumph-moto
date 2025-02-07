import { RentalRepository } from "../../repositories/RentalRepository";
import { RentalEntity } from "../../../domain/entities/RentalEntity";

export class ListRentalsByMotorcycle {
  constructor(private readonly rentalRepository: RentalRepository) {}

  async execute(motorcycleId: string): Promise<RentalEntity[]> {
    return await this.rentalRepository.findByMotorcycle(motorcycleId);
  }
}
