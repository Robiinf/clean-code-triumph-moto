import { TestDriveEntity } from "../../domain/entities/TestDriveEntity";

export interface TestDriveRepository {
  save(testDrive: TestDriveEntity): Promise<void>;
  findByDriverId(driverId: string): Promise<TestDriveEntity[]>;
  findByMotorcycleId(motorcycleId: string): Promise<TestDriveEntity[]>;
}
