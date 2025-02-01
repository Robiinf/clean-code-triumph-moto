import type { DriverEntity } from "../../domain/entities/DriverEntity";

export interface DriverRepository {
  save(driver: DriverEntity): Promise<void>;
  findById(id: string): Promise<DriverEntity | null>;
  findByCompany(companyId: string): Promise<DriverEntity[]>;
  findByDriverLicenseId(driverLicenseId: string): Promise<DriverEntity | null>;
  delete(id: string): Promise<void>;
}
