import { MaintenanceRepository } from "../../repositories/MaintenanceRepository";
import { MaintenanceEntity } from "../../../domain/entities/MaintenanceEntity";
import { NoMaintenanceLinkedToBreakdown } from "../../../domain/errors/NoMaintenanceLinkedToBreakdown";

export class GetMaintenanceByBreakdown {
  constructor(private maintenanceRepository: MaintenanceRepository) {}

  async execute(breakdownId: string): Promise<MaintenanceEntity | Error> {
    const maintenance = await this.maintenanceRepository.findByBreakdown(
      breakdownId
    );
    if (!maintenance) {
      return new NoMaintenanceLinkedToBreakdown();
    }
    return maintenance;
  }
}
