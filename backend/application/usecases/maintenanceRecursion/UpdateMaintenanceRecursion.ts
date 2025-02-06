import { MaintenanceRecursionRepository } from "../../repositories/MaintenanceRecursionRepository";
import { MaintenanceRecursionEntity } from "../../../domain/entities/MaintenanceRecursionEntity";
import { IntervalNotProvidedError } from "../../../domain/errors/IntervalNotProvidedError";
import { NegativeMileageIntervalError } from "../../../domain/errors/NegativeMileageIntervalError";
import { NegativeTimeIntervalError } from "../../../domain/errors/NegativeTimeIntervalError";
import { MaintenanceRecursionNotFound } from "../../../domain/errors/MaintenanceRecursionNotFound";

export class UpdateMaintenanceRecursion {
  constructor(
    private maintenanceRecursionRepository: MaintenanceRecursionRepository
  ) {}

  async execute(
    id: string,
    description: string,
    intervalKm: number | null,
    intervalMonths: number | null
  ): Promise<MaintenanceRecursionEntity | Error> {
    const maintenance = await this.maintenanceRecursionRepository.findById(id);
    if (!maintenance) {
      return new MaintenanceRecursionNotFound();
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

    const updatedMaintenance = maintenance.update(
      description,
      intervalKm,
      intervalMonths
    );

    await this.maintenanceRecursionRepository.save(updatedMaintenance);
    return updatedMaintenance;
  }
}
