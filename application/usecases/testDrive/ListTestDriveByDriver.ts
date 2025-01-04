import type { TestDriveRepository } from "../../repositories/TestDriveRepository";

export class ListTestDriveByDriver {
  public constructor(
    private readonly testDriveRepository: TestDriveRepository
  ) {}

  public execute(vehiculeId: string) {
    return this.testDriveRepository.findByDriverId(vehiculeId);
  }
}
