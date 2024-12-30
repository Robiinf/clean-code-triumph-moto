import { MotorcycleEntity } from "../../domain/entities/MotorcycleEntity";

export interface MotorcycleRepository {
  registerMotorcycle(motorcycle: MotorcycleEntity): Promise<MotorcycleEntity>;
  findMotorcycleById(id: string): Promise<MotorcycleEntity | null>;
  findMotocycleByVIN(vin: string): Promise<MotorcycleEntity | null>;
  updateMileage(id: string, mileage: number): Promise<MotorcycleEntity | null>;
}
