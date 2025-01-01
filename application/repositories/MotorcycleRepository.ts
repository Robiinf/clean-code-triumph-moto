import { MotorcycleEntity } from "../../domain/entities/MotorcycleEntity";
import { Mileage } from "../../domain/types/mileage";

export interface MotorcycleRepository {
  save(motorcycle: MotorcycleEntity): Promise<MotorcycleEntity>;
  findMotorcycleById(id: string): Promise<MotorcycleEntity | null>;
  findMotocycleByVIN(vin: string): Promise<MotorcycleEntity | null>;
  updateMileage(id: string, mileage: Mileage): Promise<MotorcycleEntity | null>;
}
