import type { DriverLicenseEntity } from "../../domain/entities/DriverLicenseEntity";

export interface DriverLicenseRepository {
  save(driverLicense: DriverLicenseEntity): Promise<void>;
  findById(id: string): Promise<DriverLicenseEntity | null>;
  findAll(): Promise<DriverLicenseEntity[]>;
}
