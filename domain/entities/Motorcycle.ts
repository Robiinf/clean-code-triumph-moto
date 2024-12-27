import { fuelCapacity } from "../types/fuel-capacity";
import { fuelType } from "../types/fuel-type";
import { Mileage } from "../types/mileage";
import { MotorcycleType } from "../types/motorcycle-type";
import { VIN } from "../types/vehicule-indenfication-number";

export class Motorcycle {
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
    public fuelTankCapacityInLiters: fuelCapacity
  ) {}
}
