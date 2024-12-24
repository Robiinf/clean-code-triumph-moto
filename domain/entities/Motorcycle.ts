import { fuelCapacity } from "../value-object/fuel-capacity";
import { fuelType } from "../value-object/fuel-type";
import { Mileage } from "../value-object/mileage";
import { MotorcycleType } from "../value-object/motorcycle-type";
import { VIN } from "../value-object/vehicule-indenfication-number";

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
