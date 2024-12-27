import { Maintenance } from "../../../domain/entities/Maintenance";
import { MaintenanceRepository } from "../../repositories/MaintenanceRepository";

export class EditMaintenance {
  constructor(private maintenanceRepository: MaintenanceRepository) {}

  async execute(maintenance: Maintenance): Promise<void> {
    await this.maintenanceRepository.editMaintenance(maintenance);
  }
}
