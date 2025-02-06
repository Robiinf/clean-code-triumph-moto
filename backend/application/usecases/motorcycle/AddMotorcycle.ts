import { MotorcycleEntity } from "../../../domain/entities/MotorcycleEntity";
import { FuelCapacity } from "../../../domain/types/fuel-capacity";
import { Mileage } from "../../../domain/types/mileage";
import { VIN } from "../../../domain/types/vehicle-indenfication-number";
import { MotorcycleRepository } from "../../repositories/MotorcycleRepository";
import { FuelType } from "../../../domain/types/fuelType";
import { MotorcycleType } from "../../../domain/types/motorcycleType";

export class AddMotorcycle {
  constructor(private motorcycleRepository: MotorcycleRepository) {}

  async execute(
    vin: string,
    model: string,
    year: number,
    status: string,
    mileageInKilometers: number,
    motorcycleType: string,
    power: number,
    fuelType: string,
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

    const checkedMotorcycleType = MotorcycleType.from(motorcycleType);
    if (checkedMotorcycleType instanceof Error) {
      return checkedMotorcycleType;
    }

    const checkedFuelType = FuelType.from(fuelType);
    if (checkedFuelType instanceof Error) {
      return checkedFuelType;
    }

    const motorcycle = MotorcycleEntity.create(
      checkedVin,
      model,
      year,
      status,
      checkedMileage,
      checkedMotorcycleType,
      power,
      checkedFuelType,
      transmission,
      checkedCapacity
    );

    await this.motorcycleRepository.save(motorcycle);
  }
}
