import { MaintenanceRecursionRepository } from "../../repositories/MaintenanceRecursionRepository";
import { MotorcycleRepository } from "../../repositories/MotorcycleRepository";
import { MaintenanceRecursionEntity } from "../../../domain/entities/MaintenanceRecursionEntity";
import { VehicleNotFound } from "../../../domain/errors/VehicleNotFound";
import { IntervalNotProvidedError } from "../../../domain/errors/IntervalNotProvidedError";
import { NegativeMileageIntervalError } from "../../../domain/errors/NegativeMileageIntervalError";
import { NegativeTimeIntervalError } from "../../../domain/errors/NegativeTimeIntervalError";

export class CreateMaintenanceRecursion {
  constructor(
    private maintenanceRecursionRepository: MaintenanceRecursionRepository,
    private motorcycleRepository: MotorcycleRepository
  ) {}

  async execute(
    motorcycleId: string,
    description: string,
    intervalKm: number | null,
    intervalMonths: number | null
  ): Promise<MaintenanceRecursionEntity | Error> {
    const motorcycle = await this.motorcycleRepository.findById(motorcycleId);
    if (!motorcycle) {
      return new VehicleNotFound();
    }

    if (intervalKm === null && intervalMonths === null) {
      return new IntervalNotProvidedError();
    }

    if (intervalKm !== null && intervalKm <= 0) {
      return new NegativeMileageIntervalError();
    }

    if (intervalMonths !== null && intervalMonths <= 0) {
      return new NegativeTimeIntervalError();
    }

    const maintenance = MaintenanceRecursionEntity.create(
      motorcycleId,
      description,
      intervalKm,
      intervalMonths
    );

    await this.maintenanceRecursionRepository.save(maintenance);
    return maintenance;
  }
}
