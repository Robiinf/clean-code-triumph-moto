import { WarrantyRepository } from "../../repositories/WarrantyRepository";

export class ListWarrantiesByVehicle {
  constructor(private warrantyRepository: WarrantyRepository) {}

  async execute(vehicleId: string) {
    return this.warrantyRepository.findByVehicle(vehicleId);
  }
}
