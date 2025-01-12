import { RentalRepository } from "../../repositories/RentalRepository";

export class ListAllRentals {
  constructor(private readonly rentalRepository: RentalRepository) {}

  async execute() {
    return await this.rentalRepository.findAll();
  }
}
