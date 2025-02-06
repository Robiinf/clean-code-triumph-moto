import { MaintenanceRepository } from "../../repositories/MaintenanceRepository";
import { MaintenanceEntity } from "../../../domain/entities/MaintenanceEntity";

export class GetMaintenances {
  constructor(private maintenanceRepository: MaintenanceRepository) {}

  async execute(): Promise<MaintenanceEntity[]> {
    return this.maintenanceRepository.find();
  }
}
