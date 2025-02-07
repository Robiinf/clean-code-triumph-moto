import { RentalRepository } from "../../repositories/RentalRepository";
import { RentalEntity } from "../../../domain/entities/RentalEntity";

export class ListAllRentals {
  constructor(private readonly rentalRepository: RentalRepository) {}

  async execute(): Promise<RentalEntity[]> {
    return await this.rentalRepository.findAll();
  }
}
