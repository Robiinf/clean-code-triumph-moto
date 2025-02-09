import { MaintenanceRecursionEntity } from "../../domain/entities/MaintenanceRecursionEntity";

export interface MaintenanceRecursionRepository {
  save(maintenanceRecursion: MaintenanceRecursionEntity): Promise<void>;
  findById(id: string): Promise<MaintenanceRecursionEntity | null>;
  findByMotorcycle(motorcycleId: string): Promise<MaintenanceRecursionEntity[]>;
  delete(id: string): Promise<void>;
}
