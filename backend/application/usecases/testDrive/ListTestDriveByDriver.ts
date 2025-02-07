import type { TestDriveRepository } from "../../repositories/TestDriveRepository";
import { TestDriveEntity } from "../../../domain/entities/TestDriveEntity";

export class ListTestDriveByDriver {
  constructor(private testDriveRepository: TestDriveRepository) {}

  public execute(driverId: string): Promise<TestDriveEntity[]> {
    return this.testDriveRepository.findByDriverId(driverId);
  }
}
