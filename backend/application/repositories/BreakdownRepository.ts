import { BreakdownEntity } from "../../domain/entities/BreakdownEntity";

export interface BreakdownRepository {
  save(breakdown: BreakdownEntity): Promise<void>;
  findByVehicleId(vehicleId: string): Promise<BreakdownEntity[]>;
}
