import { WarrantyRepository } from "../../repositories/WarrantyRepository";
import { WarrantyEntity } from "../../../domain/entities/WarrantyEntity";

export class AddWarranty {
  constructor(private warrantyRepository: WarrantyRepository) {}

  async execute(
    startDate: Date,
    endDate: Date,
    warrantyType: string,
    motorcyleId: string
  ) {
    const warranty = WarrantyEntity.create(
      startDate,
      endDate,
      warrantyType,
      motorcyleId
    );

    if (warranty instanceof Error) {
      return warranty;
    }

    await this.warrantyRepository.save(warranty);
  }
}
