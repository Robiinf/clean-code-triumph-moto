import { FuelCapacity } from "../types/fuel-capacity";
import { FuelType } from "../types/fuelType";
import { Mileage } from "../types/mileage";
import { MotorcycleType } from "../types/motorcycleType";
import { VIN } from "../types/vehicle-indenfication-number";
import crypto from "crypto";

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
    public fuelType: FuelType,
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
    fuelType: FuelType,
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

  public update(
    vin: VIN,
    model: string,
    year: number,
    status: string,
    mileageInKilometers: Mileage,
    motorcycleType: MotorcycleType,
    power: number,
    fuelType: FuelType,
    transmission: string,
    fuelTankCapacityInLiters: FuelCapacity
  ): MotorcycleEntity {
    return new MotorcycleEntity(
      this.id,
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
