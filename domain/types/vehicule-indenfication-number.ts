import { InvalidVehiculeIdentificationNumber } from "../errors/InvalidVehiculeIdentificationNumber";

export class VIN {
  private constructor(public readonly value: string) {}

  public static from(value: string) {
    if (value.length !== 17) {
      return new InvalidVehiculeIdentificationNumber();
    }
    return new VIN(value);
  }
}
