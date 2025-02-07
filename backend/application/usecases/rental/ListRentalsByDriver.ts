import { RentalRepository } from "../../repositories/RentalRepository";
import { RentalEntity } from "../../../domain/entities/RentalEntity";

export class ListRentalsByDriver {
  constructor(private readonly rentalRepository: RentalRepository) {}

  async execute(driverId: string): Promise<RentalEntity[]> {
    return await this.rentalRepository.findByDriver(driverId);
  }
}
