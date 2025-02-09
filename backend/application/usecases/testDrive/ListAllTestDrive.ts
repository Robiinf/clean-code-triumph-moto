import type { TestDriveRepository } from "../../repositories/TestDriveRepository";
import { TestDriveEntity } from "../../../domain/entities/TestDriveEntity";

export class ListAllTestDrive {
  constructor(private testDriveRepository: TestDriveRepository) {}

  public async execute(): Promise<TestDriveEntity[]> {
    return this.testDriveRepository.findall();
  }
}
