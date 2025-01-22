import type { IncidentEntity } from "../../domain/entities/IncidentEntity";

export interface IncidentRepository {
  save(incident: IncidentEntity): Promise<void>;
  findById(id: string): Promise<IncidentEntity | null>;
  findByDriver(driverId: string): Promise<IncidentEntity[]>;
  findByMotorcycle(motorcycleId: string): Promise<IncidentEntity[]>;
}
