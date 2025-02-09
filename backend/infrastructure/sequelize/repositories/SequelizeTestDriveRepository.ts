import { Sequelize } from "sequelize";
import { TestDriveRepository } from "../../../application/repositories/TestDriveRepository";
import { TestDriveEntity } from "../../../domain/entities/TestDriveEntity";
import { TestDriveModel } from "../models/TestDriveModel";
import { IdValidator } from "../../utils/IdValidator";

export class SequelizeTestDriveRepository implements TestDriveRepository {
  constructor(private sequelize: Sequelize) {
    TestDriveModel.initModel(sequelize);
  }

  private toEntity(testDrive: TestDriveModel): TestDriveEntity {
    return new TestDriveEntity(
      testDrive.id,
      testDrive.motorcycleId,
      testDrive.driverId,
      testDrive.sessionDate,
      testDrive.sessionDetails
    );
  }

  async findall(): Promise<TestDriveEntity[]> {
    const testDrives = await TestDriveModel.findAll();
    return testDrives.map((testDrive) => this.toEntity(testDrive));
  }

  async save(testDrive: TestDriveEntity): Promise<void> {
    const data = {
      id: testDrive.id,
      motorcycleId: testDrive.motorcycleId,
      driverId: testDrive.driverId,
      sessionDate: testDrive.sessionDate,
      sessionDetails: testDrive.sessionDetails,
    };
    await TestDriveModel.upsert(data);
  }

  async findByDriverId(driverId: string): Promise<TestDriveEntity[]> {
    if (!IdValidator.isValid(driverId)) {
      return [];
    }
    const testDrives = await TestDriveModel.findAll({
      where: { driverId },
    });
    return testDrives.map((testDrive) => this.toEntity(testDrive));
  }

  async findByMotorcycleId(motorcycleId: string): Promise<TestDriveEntity[]> {
    if (!IdValidator.isValid(motorcycleId)) {
      return [];
    }

    const testDrives = await TestDriveModel.findAll({
      where: { motorcycleId },
    });
    return testDrives.map((testDrive) => this.toEntity(testDrive));
  }
}
