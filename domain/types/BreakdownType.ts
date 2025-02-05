import { InvalidBreakdownType } from "../errors/InvalidBreakdownType";

export class BreakdownType {
  private constructor(public readonly value: string) {}

  private static readonly VALID_BREAKDOWN_TYPES = [
    "Frame",
    "Engine",
    "Fuel",
    "Brakes",
    "Wheels and Tire",
    "Battery",
    "Electrical",
    "Suspension",
    "Transmission",
    "Handlebars",
  ] as const;

  public static from(type: string): BreakdownType | InvalidBreakdownType {
    if (!this.VALID_BREAKDOWN_TYPES.includes(type as any)) {
      return new InvalidBreakdownType();
    }
    return new BreakdownType(type);
  }
}
