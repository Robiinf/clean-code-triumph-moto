import { MaintenanceRepository } from "../../repositories/MaintenanceRepository";
import { SparePartRepository } from "../../repositories/SparePartRepository";
import { MaintenanceEntity } from "../../../domain/entities/MaintenanceEntity";
import { ReplacedPartEntity } from "../../../domain/entities/ReplacedPartEntity";
import { MaintenanceNotFound } from "../../../domain/errors/MaintenanceNotFound";
import { SparePartNotFound } from "../../../domain/errors/SparePartNotFound";
import { NegativeStockError } from "../../../domain/errors/NegativeStockError";

type ReplacedPartInput = {
  sparePartId: string;
  quantity: number;
};

export class UpdateMaintenance {
  constructor(
    private maintenanceRepository: MaintenanceRepository,
    private sparePartRepository: SparePartRepository
  ) {}

  async execute(
    id: string,
    description: string,
    techniciansRecommendation: string,
    replacedParts: ReplacedPartInput[]
  ): Promise<MaintenanceEntity | Error> {
    const existingMaintenance = await this.maintenanceRepository.findById(id);
    if (!existingMaintenance) {
      return new MaintenanceNotFound();
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
      ReplacedPartEntity.create(
        existingMaintenance.id,
        part.sparePartId,
        part.quantity
      )
    );

    const updatedMaintenance = MaintenanceEntity.restore(
      existingMaintenance.id,
      existingMaintenance.motorcycleId,
      existingMaintenance.maintenanceDate,
      existingMaintenance.maintenanceType,
      description,
      techniciansRecommendation,
      existingMaintenance.currentMotorcycleMileage,
      replacedPartEntities,
      existingMaintenance.breakdownId,
      existingMaintenance.maintenanceRecursionId
    );

    for (const oldPart of existingMaintenance.replacedParts) {
      const sparePart = await this.sparePartRepository.findById(
        oldPart.sparePartId
      );
      if (sparePart) {
        await this.sparePartRepository.updateStockQuantity(
          oldPart.sparePartId,
          sparePart.stockQuantity + oldPart.quantity
        );
      }
    }

    for (const newPart of replacedParts) {
      const sparePart = await this.sparePartRepository.findById(
        newPart.sparePartId
      );
      if (sparePart) {
        await this.sparePartRepository.updateStockQuantity(
          newPart.sparePartId,
          sparePart.stockQuantity - newPart.quantity
        );
      }
    }

    await this.maintenanceRepository.save(updatedMaintenance);

    return updatedMaintenance;
  }
}
