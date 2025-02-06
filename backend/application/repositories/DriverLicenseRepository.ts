import type { DriverLicenseEntity } from "../../domain/entities/DriverLicenseEntity";

export interface DriverLicenseRepository {
  save(driverLicense: DriverLicenseEntity, driverId: string): Promise<void>;
  findById(id: string): Promise<DriverLicenseEntity | null>;
  findByDriver(driverId: string): Promise<DriverLicenseEntity | null>;
  delete(id: string): Promise<void>;
}
