import { RentalEntity } from "../../domain/entities/RentalEntity";

export interface RentalRepository {
  save(rental: RentalEntity): Promise<RentalEntity>;
  findAll(): Promise<RentalEntity[]>;
  findById(id: string): Promise<RentalEntity | null>;
  findByMotorcycle(id: string): Promise<RentalEntity[]>;
  findByDriver(id: string): Promise<RentalEntity[]>;
}
