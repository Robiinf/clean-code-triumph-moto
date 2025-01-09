import { BreakdownRepository } from "../../repositories/BreakdownRepository";

export class ListBreakdownByVehicle {
  constructor(private readonly breakdownRepository: BreakdownRepository) {}

  async execute(vehicleId: string) {
    return await this.breakdownRepository.findByVehicleId(vehicleId);
  }
}
