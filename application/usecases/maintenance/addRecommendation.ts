import { MaintenanceEntity } from "../../../domain/entities/MaintenanceEntity";
import { MaintenanceRepository } from "../../repositories/MaintenanceRepository";

export class AddRecommendation {
  constructor(private maintenanceRepository: MaintenanceRepository) {}

  async execute(
    maintenance: MaintenanceEntity,
    recommendation: string
  ): Promise<void> {
    if (recommendation.length < 10) {
      throw new Error("Recommendation must be at least 10 characters long");
    }

    await this.maintenanceRepository.addRecommendation(
      maintenance,
      recommendation
    );
  }
}
