import { MaintenanceRepository } from "../../repositories/MaintenanceRepository";
import { MotorcycleRepository } from "../../repositories/MotorcycleRepository";
import { SparePartRepository } from "../../repositories/SparePartRepository";
import { MaintenanceEntity } from "../../../domain/entities/MaintenanceEntity";
import { ReplacedPartEntity } from "../../../domain/entities/ReplacedPartEntity";
import { MaintenanceType } from "../../../domain/types/MaintenanceType";
import { VehicleNotFound } from "../../../domain/errors/VehicleNotFound";
import { SparePartNotFound } from "../../../domain/errors/SparePartNotFound";
import { NegativeStockError } from "../../../domain/errors/NegativeStockError";
import { MaintenanceRecursionNotFound } from "../../../domain/errors/MaintenanceRecursionNotFound";
import { MaintenanceRecursionRepository } from "../../repositories/MaintenanceRecursionRepository";
import { Mileage } from "../../../domain/types/mileage";

type ReplacedPartInput = {
  sparePartId: string;
  quantity: number;
};

export class CreateMaintenance {
  constructor(
    private maintenanceRepository: MaintenanceRepository,
    private motorcycleRepository: MotorcycleRepository,
    private maintenanceRecursionRepository: MaintenanceRecursionRepository,
    private sparePartRepository: SparePartRepository
  ) {}

  async execute(
    motorcycleId: string,
    maintenanceDate: Date,
    maintenanceType: string,
    description: string,
    techniciansRecommendation: string,
    replacedParts: ReplacedPartInput[],
    breakdownId?: string,
    maintenanceRecursionId?: string
  ): Promise<MaintenanceEntity | Error> {
    const motorcycle = await this.motorcycleRepository.findById(motorcycleId);
    if (!motorcycle) {
      return new VehicleNotFound();
    }

    if (maintenanceRecursionId) {
      const maintenanceRecursion =
        await this.maintenanceRecursionRepository.findById(
          maintenanceRecursionId
        );
      if (!maintenanceRecursion) {
        return new MaintenanceRecursionNotFound();
      }
    }

    const checkedMaintenanceType = MaintenanceType.from(maintenanceType);
    if (checkedMaintenanceType instanceof Error) {
      return checkedMaintenanceType;
    }

    for (const part of replacedParts) {
      const sparePart = await this.sparePartRepository.findById(
        part.sparePartId
      );
      if (!sparePart) {
        return new SparePartNotFound();
      }
      if (sparePart.stockQuantity < part.quantity) {
        return new NegativeStockError();
      }
    }

    const replacedPartEntities = replacedParts.map((part) =>
      ReplacedPartEntity.create("", part.sparePartId, part.quantity)
    );

    const maintenance = MaintenanceEntity.create(
      motorcycleId,
      maintenanceDate,
      checkedMaintenanceType,
      description,
      techniciansRecommendation,
      motorcycle.mileageInKilometers,
      replacedPartEntities,
      breakdownId,
      maintenanceRecursionId
    );

    maintenance.replacedParts.forEach(
      (part) => (part.maintenanceId = maintenance.id)
    );

    await this.maintenanceRepository.save(maintenance);

    for (const part of replacedParts) {
      const sparePart = await this.sparePartRepository.findById(
        part.sparePartId
      );
      await this.sparePartRepository.updateStockQuantity(
        part.sparePartId,
        sparePart!.stockQuantity - part.quantity
      );
    }

    return maintenance;
  }
}
