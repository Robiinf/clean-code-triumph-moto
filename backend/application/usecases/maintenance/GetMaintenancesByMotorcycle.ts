import { MaintenanceRepository } from "../../repositories/MaintenanceRepository";
import { MaintenanceEntity } from "../../../domain/entities/MaintenanceEntity";

export class GetMaintenancesByMotorcycle {
  constructor(private maintenanceRepository: MaintenanceRepository) {}

  async execute(motorcycleId: string): Promise<MaintenanceEntity[]> {
    return this.maintenanceRepository.findByMotorcycle(motorcycleId);
  }
}
