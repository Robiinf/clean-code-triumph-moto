import { BreakdownRepository } from "../../repositories/BreakdownRepository";

export class ListBreakdownByVehicule {
  constructor(private readonly breakdownRepository: BreakdownRepository) {}

  async execute(vehicleId: string) {
    return await this.breakdownRepository.findByVehicleId(vehicleId);
  }
}
