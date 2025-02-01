import { Sequelize } from "sequelize";
import { MotorcycleRepository } from "../../../application/repositories/MotorcycleRepository";
import { MotorcycleModel } from "../models/MotorcycleModel";
import { MotorcycleEntity } from "../../../domain/entities/MotorcycleEntity";
import { VIN } from "../../../domain/types/vehicle-indenfication-number";
import { Mileage } from "../../../domain/types/mileage";
import { MotorcycleType } from "../../../domain/types/motorcycleType";
import { FuelType } from "../../../domain/types/fuelType";
import { FuelCapacity } from "../../../domain/types/fuel-capacity";

export class SequelizeMotorcycleRepository implements MotorcycleRepository {
  constructor(private sequelize: Sequelize) {
    MotorcycleModel.initModel(sequelize);
  }

  async save(motorcycle: MotorcycleEntity): Promise<void> {
    const data = {
      id: motorcycle.id,
      vin: motorcycle.vin.value,
      model: motorcycle.model,
      year: motorcycle.year,
      status: motorcycle.status,
      mileageInKilometers: motorcycle.mileageInKilometers.value,
      motorcycleType: motorcycle.motorcycleType.value,
      power: motorcycle.power,
      fuelType: motorcycle.fuelType.value,
      transmission: motorcycle.transmission,
      fuelTankCapacityInLiters: motorcycle.fuelTankCapacityInLiters.value,
    };
    await MotorcycleModel.upsert(data);
  }

  async findById(id: string): Promise<MotorcycleEntity | null> {
    const motorcycle = await MotorcycleModel.findByPk(id);
    if (!motorcycle) {
      return null;
    }
    return this.toEntity(motorcycle);
  }

  async findAll(): Promise<MotorcycleEntity[]> {
    const motorcycles = await MotorcycleModel.findAll();
    return motorcycles.map((motorcycle) => this.toEntity(motorcycle));
  }

  async delete(id: string): Promise<void> {
    await MotorcycleModel.destroy({ where: { id } });
  }

  private toEntity(motorcycle: MotorcycleModel): MotorcycleEntity {
    const checkedVin = VIN.from(motorcycle.vin);
    const checkedMileage = Mileage.from(motorcycle.mileageInKilometers);
    const checkedMotorcycleType = MotorcycleType.from(
      motorcycle.motorcycleType
    );
    const checkedFuelType = FuelType.from(motorcycle.fuelType);
    const checkedFuelTankCapacity = FuelCapacity.from(
      motorcycle.fuelTankCapacityInLiters
    );

    if (
      checkedVin instanceof Error ||
      checkedMileage instanceof Error ||
      checkedMotorcycleType instanceof Error ||
      checkedFuelType instanceof Error ||
      checkedFuelTankCapacity instanceof Error
    ) {
      throw new Error("Invalid motorcycle data");
    }

    return new MotorcycleEntity(
      motorcycle.id,
      checkedVin,
      motorcycle.model,
      motorcycle.year,
      motorcycle.status,
      checkedMileage,
      checkedMotorcycleType,
      motorcycle.power,
      checkedFuelType,
      motorcycle.transmission,
      checkedFuelTankCapacity
    );
  }
}
