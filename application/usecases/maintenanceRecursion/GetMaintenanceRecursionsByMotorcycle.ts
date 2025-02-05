import { MaintenanceRecursionRepository } from "../../repositories/MaintenanceRecursionRepository";
import { MaintenanceRecursionEntity } from "../../../domain/entities/MaintenanceRecursionEntity";

export class GetMaintenanceRecursionsByMotorcycle {
  constructor(
    private maintenanceRecursionRepository: MaintenanceRecursionRepository
  ) {}

  async execute(motorcycleId: string): Promise<MaintenanceRecursionEntity[]> {
    return this.maintenanceRecursionRepository.findByMotorcycle(motorcycleId);
  }
}
