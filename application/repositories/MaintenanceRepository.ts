import { MaintenanceEntity } from "../../domain/entities/MaintenanceEntity";

export interface MaintenanceRepository {
  createMaintenance(maintenance: MaintenanceEntity): Promise<MaintenanceEntity>;
  editMaintenance(maintenance: MaintenanceEntity): Promise<MaintenanceEntity>;
  addRecommendation(
    maintenance: MaintenanceEntity,
    recommendation: string
  ): Promise<MaintenanceEntity>;
}
