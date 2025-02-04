import { MotorcycleEntity } from "../../../domain/entities/MotorcycleEntity";
import { FuelCapacity } from "../../../domain/types/fuel-capacity";
import { Mileage } from "../../../domain/types/mileage";
import { VIN } from "../../../domain/types/vehicle-indenfication-number";
import { MotorcycleRepository } from "../../repositories/MotorcycleRepository";
import { FuelType } from "../../../domain/types/fuelType";
import { MotorcycleType } from "../../../domain/types/motorcycleType";
import { VehicleNotFound } from "../../../domain/errors/VehicleNotFound";

export class EditMotorcycle {
  constructor(private readonly motorcycleRepository: MotorcycleRepository) {}

  async execute(
    id: string,
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
    const motorcycle = await this.motorcycleRepository.findById(id);

    if (!motorcycle) {
      return new VehicleNotFound();
    }

    const checkedVin = VIN.from(vin);
    if (checkedVin instanceof Error) {
      return checkedVin;
    }

    const checkedMileage = Mileage.from(mileageInKilometers);
    if (checkedMileage instanceof Error) {
      return checkedMileage;
    }

    const checkedMotorcycleType = MotorcycleType.from(motorcycleType);
    if (checkedMotorcycleType instanceof Error) {
      return checkedMotorcycleType;
    }

    const checkedFuelType = FuelType.from(fuelType);
    if (checkedFuelType instanceof Error) {
      return checkedFuelType;
    }

    const checkedFuelCapacity = FuelCapacity.from(fuelTankCapacityInLiters);
    if (checkedFuelCapacity instanceof Error) {
      return checkedFuelCapacity;
    }

    const updatedMotorcycle = motorcycle.update(
      checkedVin,
      model,
      year,
      status,
      checkedMileage,
      checkedMotorcycleType,
      power,
      checkedFuelType,
      transmission,
      checkedFuelCapacity
    );

    await this.motorcycleRepository.save(updatedMotorcycle);
  }
}
