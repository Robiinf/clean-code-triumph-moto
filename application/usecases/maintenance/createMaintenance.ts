import { MaintenanceEntity } from "../../../domain/entities/MaintenanceEntity";
import { InvalidMaintenanceDate } from "../../../domain/errors/InvalidMaintenanceDate";
import { InvalidMaintenanceType } from "../../../domain/errors/InvalidMaintenanceType";
import { MaintenanceRepository } from "../../repositories/MaintenanceRepository";

export class CreateMaintenance {
  constructor(private maintenanceRepository: MaintenanceRepository) {}

  async execute(
    maintenance: MaintenanceEntity
  ): Promise<void | InvalidMaintenanceDate | InvalidMaintenanceType> {
    if (maintenance.date === null || maintenance.date === undefined) {
      return new InvalidMaintenanceDate();
    }

    if (maintenance.type === null || maintenance.type === undefined) {
      return new InvalidMaintenanceType();
    }

    await this.maintenanceRepository.createMaintenance(maintenance);
  }
}
