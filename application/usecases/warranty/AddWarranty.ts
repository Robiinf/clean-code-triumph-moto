import { WarrantyRepository } from "../../repositories/WarrantyRepository";
import { WarrantyEntity } from "../../../domain/entities/WarrantyEntity";
import { MotorcycleRepository } from "../../repositories/MotorcycleRepository";
import { VehicleNotFound } from "../../../domain/errors/VehicleNotFound";

export class AddWarranty {
  constructor(
    private warrantyRepository: WarrantyRepository,
    private motorcycleRepository: MotorcycleRepository
  ) {}

  async execute(
    startDate: Date,
    endDate: Date,
    warrantyType: string,
    motorcyleId: string,
    warrantyDescription: string
  ) {
    const motorcycle = await this.motorcycleRepository.findById(motorcyleId);
    if (!motorcycle) {
      return new VehicleNotFound();
    }

    const warranty = WarrantyEntity.create(
      startDate,
      endDate,
      warrantyType,
      motorcyleId,
      warrantyDescription
    );

    if (warranty instanceof Error) {
      return warranty;
    }

    await this.warrantyRepository.save(warranty);
  }
}
