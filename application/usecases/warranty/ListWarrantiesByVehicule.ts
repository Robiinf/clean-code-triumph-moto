import { WarrantyRepository } from "../../repositories/WarrantyRepository";

export class ListWarrantiesByVehicule {
  constructor(private warrantyRepository: WarrantyRepository) {}

  async execute(vehicleId: string) {
    return this.warrantyRepository.findByVehicle(vehicleId);
  }
}
