import { WarrantyRepository } from "../../repositories/WarrantyRepository";
import { InvalidDateImpossible } from "../../../domain/errors/InvalidDateImpossible";
import { WarrantyNotFound } from "../../../domain/errors/WarrantyNotFound";

export class ExtendWarranty {
  constructor(private warrantyRepository: WarrantyRepository) {}

  async execute(id: string, newEndDate: Date): Promise<void | Error> {
    const warranty = await this.warrantyRepository.findById(id);
    if (!warranty) {
      return new WarrantyNotFound();
    }

    if (newEndDate <= new Date()) {
      return new InvalidDateImpossible();
    }

    if (newEndDate <= warranty.endDate) {
      return new InvalidDateImpossible();
    }

    warranty.endDate = newEndDate;
    await this.warrantyRepository.save(warranty);
  }
}
