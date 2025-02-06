import { WarrantyRepository } from "../../repositories/WarrantyRepository";
import { WarrantyEntity } from "../../../domain/entities/WarrantyEntity";
import { WarrantyNotFound } from "../../../domain/errors/WarrantyNotFound";

export class GetWarrantyById {
  constructor(private warrantyRepository: WarrantyRepository) {}

  async execute(id: string): Promise<WarrantyEntity | Error> {
    const warranty = await this.warrantyRepository.findById(id);
    if (!warranty) {
      return new WarrantyNotFound();
    }
    return warranty;
  }
}
