import { MaintenanceRecursionRepository } from "../../repositories/MaintenanceRecursionRepository";
import { MaintenanceRecursionNotFound } from "../../../domain/errors/MaintenanceRecursionNotFound";

export class DeleteMaintenanceRecursion {
  constructor(
    private maintenanceRecursionRepository: MaintenanceRecursionRepository
  ) {}

  async execute(id: string): Promise<void | Error> {
    const maintenance = await this.maintenanceRecursionRepository.findById(id);
    if (!maintenance) {
      return new MaintenanceRecursionNotFound();
    }

    await this.maintenanceRecursionRepository.delete(id);
  }
}
