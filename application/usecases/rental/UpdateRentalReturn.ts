import { RentalRepository } from "../../repositories/RentalRepository";
import { NotFoundRentalError } from "../../../domain/errors/NotFoundRentalError";

export class UpdateRentalReturn {
  constructor(private rentalRepository: RentalRepository) {}

  async execute(id: string, returnDate: Date) {
    const rental = await this.rentalRepository.findById(id);

    if (!rental) {
      return new NotFoundRentalError();
    }
    const updatedRental = rental.update(returnDate);

    if (updatedRental instanceof Error) {
      return updatedRental;
    }

    await this.rentalRepository.save(updatedRental);
  }
}
