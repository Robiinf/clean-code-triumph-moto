import { WarrantyRepository } from "../../repositories/WarrantyRepository";
import { WarrantyNotFound } from "../../../domain/errors/WarrantyNotFound";
import { InvalidWarrantyType } from "../../../domain/errors/InvalidWarrantyType";

export class UpdateWarrantyStatus {
  constructor(private warrantyRepository: WarrantyRepository) {}

  async execute(id: string, newStatus: string): Promise<void | Error> {
    const warranty = await this.warrantyRepository.findById(id);
    if (!warranty) {
      return new WarrantyNotFound();
    }

    const validStatuses = ["active", "expired", "cancelled"];
    if (!validStatuses.includes(newStatus)) {
      return new InvalidWarrantyType();
    }

    warranty.warrantyStatus = newStatus;
    await this.warrantyRepository.save(warranty);
  }
}
