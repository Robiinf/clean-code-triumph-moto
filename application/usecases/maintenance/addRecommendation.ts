import { MaintenanceEntity } from "../../../domain/entities/MaintenanceEntity";
import { MaintenanceRepository } from "../../repositories/MaintenanceRepository";

export class AddRecommendation {
  constructor(private maintenanceRepository: MaintenanceRepository) {}

  async execute(maintenance: MaintenanceEntity): Promise<void> {
    await this.maintenanceRepository.addRecommendation(
      maintenance,
      maintenance.recommendation
    );
  }
}
