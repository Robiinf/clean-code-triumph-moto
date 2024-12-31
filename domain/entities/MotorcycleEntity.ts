import { FuelCapacity } from "../types/fuel-capacity";
import { fuelType } from "../types/fuel-type";
import { Mileage } from "../types/mileage";
import { MotorcycleType } from "../types/motorcycle-type";
import { VIN } from "../types/vehicule-indenfication-number";

export class MotorcycleEntity {
  constructor(
    public id: string,
    public vin: VIN,
    public model: string,
    public year: number,
    public status: string,
    public mileageInKilometers: Mileage,
    public motorcycleType: MotorcycleType,
    public power: number,
    public fuelType: fuelType,
    public transmission: string,
    public fuelTankCapacityInLiters: FuelCapacity
  ) {}

  public static create(
    vin: VIN,
    model: string,
    year: number,
    status: string,
    mileageInKilometers: Mileage,
    motorcycleType: MotorcycleType,
    power: number,
    fuelType: fuelType,
    transmission: string,
    fuelTankCapacityInLiters: FuelCapacity
  ): MotorcycleEntity {
    const id = crypto.randomUUID();
    return new MotorcycleEntity(
      id,
      vin,
      model,
      year,
      status,
      mileageInKilometers,
      motorcycleType,
      power,
      fuelType,
      transmission,
      fuelTankCapacityInLiters
    );
  }
}
