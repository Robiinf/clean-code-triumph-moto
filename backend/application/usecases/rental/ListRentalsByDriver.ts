import { RentalRepository } from "../../repositories/RentalRepository";

export class ListRentalsByDriver {
  constructor(private readonly rentalRepository: RentalRepository) {}

  async execute(driverId: string) {
    return await this.rentalRepository.findByDriver(driverId);
  }
}
