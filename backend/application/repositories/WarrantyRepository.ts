import { WarrantyEntity } from "../../domain/entities/WarrantyEntity";

export interface WarrantyRepository {
  save(warranty: WarrantyEntity): Promise<void>;
  findByVehicle(vehicleId: string): Promise<WarrantyEntity[]>;
  findById(id: string): Promise<WarrantyEntity | null>;
}
