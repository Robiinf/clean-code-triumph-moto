import { RentalRepository } from "../../repositories/RentalRepository";
import { NotFoundRentalError } from "../../../domain/errors/NotFoundRentalError";

export class GetRentalById {
  constructor(private readonly rentalRepository: RentalRepository) {}

  async execute(rentalId: string) {
    const warranty = await this.rentalRepository.findById(rentalId);
    if (!warranty) {
      return new NotFoundRentalError();
    }
    return warranty;
  }
}
