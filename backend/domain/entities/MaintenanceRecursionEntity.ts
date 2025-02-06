import crypto from "crypto";

export class MaintenanceRecursionEntity {
  private constructor(
    public id: string,
    public motorcycleId: string,
    public description: string,
    public intervalKm: number | null,
    public intervalMonths: number | null
  ) {}

  public static create(
    motorcycleId: string,
    description: string,
    intervalKm: number | null,
    intervalMonths: number | null
  ): MaintenanceRecursionEntity {
    const id = crypto.randomUUID();
    return new MaintenanceRecursionEntity(
      id,
      motorcycleId,
      description,
      intervalKm,
      intervalMonths
    );
  }

  public static restore(
    id: string,
    motorcycleId: string,
    description: string,
    intervalKm: number | null,
    intervalMonths: number | null
  ): MaintenanceRecursionEntity {
    return new MaintenanceRecursionEntity(
      id,
      motorcycleId,
      description,
      intervalKm,
      intervalMonths
    );
  }

  public update(
    description: string,
    intervalKm: number | null,
    intervalMonths: number | null
  ): MaintenanceRecursionEntity {
    return MaintenanceRecursionEntity.restore(
      this.id,
      this.motorcycleId,
      description,
      intervalKm,
      intervalMonths
    );
  }
}
