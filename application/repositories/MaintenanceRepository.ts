import { Maintenance } from "../../domain/entities/Maintenance";

export interface MaintenanceRepository {
  createMaintenance(maintenance: Maintenance): Promise<Maintenance>;
  editMaintenance(maintenance: Maintenance): Promise<Maintenance>;
  addRecommendation(
    maintenance: Maintenance,
    recommendation: string
  ): Promise<Maintenance>;
}
