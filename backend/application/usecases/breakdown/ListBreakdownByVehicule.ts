import { BreakdownRepository } from "../../repositories/BreakdownRepository";
import { BreakdownEntity } from "../../../domain/entities/BreakdownEntity";

export class ListBreakdownByVehicle {
  constructor(private readonly breakdownRepository: BreakdownRepository) {}

  async execute(vehicleId: string): Promise<BreakdownEntity[]> {
    return await this.breakdownRepository.findByVehicleId(vehicleId);
  }
}
