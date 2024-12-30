import { MaintenanceEntity } from "../../../domain/entities/MaintenanceEntity";
import { MaintenanceRepository } from "../../repositories/MaintenanceRepository";

export class CreateMaintenance {
  constructor(private maintenanceRepository: MaintenanceRepository) {}

  async execute(maintenance: MaintenanceEntity): Promise<void> {
    await this.maintenanceRepository.createMaintenance(maintenance);
  }
}
