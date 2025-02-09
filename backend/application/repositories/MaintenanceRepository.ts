import { MaintenanceEntity } from "../../domain/entities/MaintenanceEntity";

export interface MaintenanceRepository {
  save(maintenance: MaintenanceEntity): Promise<void>;
  findById(id: string): Promise<MaintenanceEntity | null>;
  find(): Promise<MaintenanceEntity[]>;
  findByMotorcycle(motorcycleId: string): Promise<MaintenanceEntity[]>;
  findByBreakdown(breakdownId: string): Promise<MaintenanceEntity | null>;
}

