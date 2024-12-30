import { MaintenanceEntity } from "../../../domain/entities/MaintenanceEntity";
import { MaintenanceRepository } from "../../repositories/MaintenanceRepository";

export class EditMaintenance {
  constructor(private maintenanceRepository: MaintenanceRepository) {}

  async execute(maintenance: MaintenanceEntity): Promise<void> {
    await this.maintenanceRepository.editMaintenance(maintenance);
  }
}
