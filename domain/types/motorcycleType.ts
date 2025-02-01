import { InvalidMotorcycleType } from "../errors/InvalidMotorcycleType";

export class MotorcycleType {
  private constructor(public readonly value: string) {}

  private static readonly VALID_TYPES = [
    "Cruiser",
    "Touring",
    "Adventure",
    "Sportbike",
    "Naked",
    "Scrambler",
    "Café Racer",
    "Bobber",
    "Classic / Modern Classic",
    "Dirt Bike",
    "Supermoto",
    "Electric Motorcycle",
  ] as const;

  public static from(type: string): MotorcycleType | InvalidMotorcycleType {
    if (!this.VALID_TYPES.includes(type as any)) {
      return new InvalidMotorcycleType();
    }
    return new MotorcycleType(type);
  }
}
