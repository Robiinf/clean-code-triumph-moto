import { InvalidMaintenanceType } from "../errors/InvalidMaintenanceType";

export class MaintenanceType {
  private constructor(public readonly value: string) {}

  private static readonly VALID_TYPES = [
    "Preventive",
    "Corrective",
    "Predictive",
    "Adjustive",
    "Evolutionary",
    "Condition-based",
    "Legal and Mandatory",
  ] as const;

  public static from(type: string): MaintenanceType | InvalidMaintenanceType {
    if (!this.VALID_TYPES.includes(type as any)) {
      return new InvalidMaintenanceType();
    }
    return new MaintenanceType(type);
  }
}
