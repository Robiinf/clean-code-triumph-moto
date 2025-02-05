import { SparePartEntity } from "../../domain/entities/SparePartEntity";

export interface SparePartRepository {
  save(sparePart: SparePartEntity): Promise<void>;
  findById(id: string): Promise<SparePartEntity | null>;
  findAll(): Promise<SparePartEntity[]>;
  delete(id: string): Promise<void>;

  updateStockQuantity(id: string, quantity: number): Promise<void>;
  updateAlertLowStock(id: string, quantity: number): Promise<void>;
  findLowStock(): Promise<SparePartEntity[]>;

  findByName(name: string): Promise<SparePartEntity[]>;
}
