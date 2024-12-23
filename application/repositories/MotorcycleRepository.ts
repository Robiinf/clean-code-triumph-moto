import { Motorcycle } from "../../domain/entities/Motorcycle";

export interface MotorcycleRepository {
  registerMotorcycle(motorcycle: Motorcycle): Promise<Motorcycle>;
  findMotorcycleById(id: string): Promise<Motorcycle | null>;
  findMotocycleByVIN(vin: string): Promise<Motorcycle | null>;
  updateMileage(id: string, mileage: number): Promise<Motorcycle | null>;
}
