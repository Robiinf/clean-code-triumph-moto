import { TestDriveRepository } from "../../repositories/TestDriveRepository";
import { MotorcycleRepository } from "../../repositories/MotorcycleRepository";
import { TestDriveEntity } from "../../../domain/entities/TestDriveEntity";
import { VehicleNotFound } from "../../../domain/errors/VehicleNotFound";
import { DriverNotFound } from "../../../domain/errors/DriverNotFound";

export class CreateTestDrive {
  constructor(
    private testDriveRepository: TestDriveRepository,
    private motorcycleRepository: MotorcycleRepository
  ) {}

  public async execute(
    driverId: string,
    motorcycleId: string,
    sessionDate: Date,
    sessionDetails: string
  ) {
    const motorcycle = await this.motorcycleRepository.findById(motorcycleId);
    if (!motorcycle) {
      return new VehicleNotFound();
    }

    const driver = await this.motorcycleRepository.findById(driverId);
    if (!driver) {
      return new DriverNotFound();
    }

    const testDrive = TestDriveEntity.create(
      motorcycleId,
      driverId,
      sessionDate,
      sessionDetails
    );

    await this.testDriveRepository.save(testDrive);
  }
}
