import { MotorcycleEntity } from "../../domain/entities/MotorcycleEntity";

export interface MotorcycleRepository {
  save(motorcycle: MotorcycleEntity): Promise<void>;
  findById(id: string): Promise<MotorcycleEntity | null>;
  findAll(): Promise<MotorcycleEntity[]>;
  delete(id: string): Promise<void>;
}
