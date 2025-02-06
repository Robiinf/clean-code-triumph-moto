import type { TestDriveRepository } from "../../repositories/TestDriveRepository";

export class ListTestDriveByDriver {
  constructor(private testDriveRepository: TestDriveRepository) {}

  public execute(driverId: string) {
    return this.testDriveRepository.findByDriverId(driverId);
  }
}
