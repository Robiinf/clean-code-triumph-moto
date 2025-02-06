import type { TestDriveRepository } from "../../repositories/TestDriveRepository";

export class ListTestDriveByVehicule {
  public constructor(
    private readonly testDriveRepository: TestDriveRepository
  ) {}

  public execute(vehiculeId: string) {
    return this.testDriveRepository.findByMotorcycleId(vehiculeId);
  }
}
