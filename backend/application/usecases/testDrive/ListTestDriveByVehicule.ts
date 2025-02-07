import type { TestDriveRepository } from "../../repositories/TestDriveRepository";
import { TestDriveEntity } from "../../../domain/entities/TestDriveEntity";

export class ListTestDriveByVehicule {
  public constructor(
    private readonly testDriveRepository: TestDriveRepository
  ) {}

  public execute(vehiculeId: string): Promise<TestDriveEntity[]> {
    return this.testDriveRepository.findByMotorcycleId(vehiculeId);
  }
}
