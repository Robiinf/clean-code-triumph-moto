import { InvalidVehicleIdentificationNumber } from "../errors/InvalidVehicleIdentificationNumber";

export class VIN {
  private constructor(public readonly value: string) {}

  public static from(value: string) {
    if (value.length !== 17) {
      return new InvalidVehicleIdentificationNumber();
    }
    return new VIN(value);
  }
}
