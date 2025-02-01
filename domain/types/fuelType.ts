import { InvalidFuelType } from "../errors/InvalidFuelType";

export class FuelType {
  private constructor(public readonly value: string) {}

  private static readonly VALID_FUEL_TYPES = [
    "Unleaded Gas",
    "Ethanol-Blended Gasoline",
    "Diesel",
    "Electric",
    "Hybrid",
    "Biofuel",
    "Compressed Natural Gas",
  ] as const;

  public static from(type: string): FuelType | InvalidFuelType {
    if (!this.VALID_FUEL_TYPES.includes(type as any)) {
      return new InvalidFuelType();
    }
    return new FuelType(type);
  }
}
