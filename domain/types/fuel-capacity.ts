import { CapacityNegative } from "../errors/CapacityNegativ";

export class FuelCapacity {
  private constructor(public readonly value: number) {}

  public static from(capacity: number) {
    if (capacity < 0) {
      return new CapacityNegative();
    }
    return new FuelCapacity(capacity);
  }
}
