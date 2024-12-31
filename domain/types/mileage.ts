import { NegativeMileage } from "../errors/NegativeMileage";

export class Mileage {
  private constructor(public readonly value: number) {}

  public static from(value: number) {
    if (value < 0) {
      return new NegativeMileage();
    }
    return new Mileage(value);
  }
}
