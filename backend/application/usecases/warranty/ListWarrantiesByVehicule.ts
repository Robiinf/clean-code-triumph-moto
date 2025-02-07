import { WarrantyRepository } from "../../repositories/WarrantyRepository";
import { WarrantyEntity } from "../../../domain/entities/WarrantyEntity";

export class ListWarrantiesByVehicle {
  constructor(private warrantyRepository: WarrantyRepository) {}

  async execute(vehicleId: string): Promise<WarrantyEntity[]> {
    return this.warrantyRepository.findByVehicle(vehicleId);
  }
}
