import crypto from "crypto";

export class TestDriveEntity {
  constructor(
    public id: string,
    public motorcycleId: string,
    public driverId: string,
    public sessionDate: Date,
    public sessionDetails: string
  ) {}

  public static create(
    motorcycleId: string,
    driverId: string,
    sessionDate: Date,
    sessionDetails: string
  ): TestDriveEntity {
    const id = crypto.randomUUID();
    return new TestDriveEntity(
      id,
      motorcycleId,
      driverId,
      sessionDate,
      sessionDetails
    );
  }
}
