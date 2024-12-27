import { Maintenance } from "../../../domain/entities/Maintenance";
import { MaintenanceRepository } from "../../repositories/MaintenanceRepository";

export class CreateMaintenance {
  constructor(private maintenanceRepository: MaintenanceRepository) {}

  async execute(maintenance: Maintenance): Promise<void> {
    await this.maintenanceRepository.createMaintenance(maintenance);
  }
}
