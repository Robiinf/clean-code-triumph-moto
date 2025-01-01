import { MotorcycleEntity } from "../../../domain/entities/MotorcycleEntity";
import { FuelCapacity } from "../../../domain/types/fuel-capacity";
import { fuelType } from "../../../domain/types/fuel-type";
import { Mileage } from "../../../domain/types/mileage";
import { MotorcycleType } from "../../../domain/types/motorcycle-type";
import { VIN } from "../../../domain/types/vehicule-indenfication-number";
import { MotorcycleRepository } from "../../repositories/MotorcycleRepository";

export class RegisterMotorcycle {
  constructor(private motorcycleRepository: MotorcycleRepository) {}

  async execute(
    vin: string,
    model: string,
    year: number,
    status: string,
    mileageInKilometers: number,
    motorcycleType: MotorcycleType,
    power: number,
    fuelType: fuelType,
    transmission: string,
    fuelTankCapacityInLiters: number
  ) {
    const checkedVin = VIN.from(vin);
    if (checkedVin instanceof Error) {
      return checkedVin;
    }

    const checkedMileage = Mileage.from(mileageInKilometers);

    if (checkedMileage instanceof Error) {
      return checkedMileage;
    }

    const checkedCapacity = FuelCapacity.from(fuelTankCapacityInLiters);

    if (checkedCapacity instanceof Error) {
      return checkedCapacity;
    }

    const motorcycle = MotorcycleEntity.create(
      checkedVin,
      model,
      year,
      status,
      checkedMileage,
      motorcycleType,
      power,
      fuelType,
      transmission,
      checkedCapacity
    );

    await this.motorcycleRepository.save(motorcycle);
  }
}
