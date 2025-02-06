import { Sequelize } from "sequelize";
import { MaintenanceRepository } from "../../../application/repositories/MaintenanceRepository";
import { MaintenanceEntity } from "../../../domain/entities/MaintenanceEntity";
import { MaintenanceModel } from "../models/MaintenanceModel";
import { ReplacedPartModel } from "../models/ReplacedPartModel";
import { IdValidator } from "../../utils/IdValidator";
import { ReplacedPartEntity } from "../../../domain/entities/ReplacedPartEntity";
import { Mileage } from "../../../domain/types/mileage";
import { MaintenanceType } from "../../../domain/types/MaintenanceType";

export class SequelizeMaintenanceRepository implements MaintenanceRepository {
  constructor(private sequelize: Sequelize) {
    MaintenanceModel.initModel(sequelize);
    ReplacedPartModel.initModel(sequelize);
  }

  private async getReplacedParts(
    maintenanceId: string
  ): Promise<ReplacedPartEntity[]> {
    const parts = await ReplacedPartModel.findAll({ where: { maintenanceId } });
    return parts.map((part) =>
      ReplacedPartEntity.create(
        part.maintenanceId,
        part.sparePartId,
        part.quantity
      )
    );
  }

  async save(maintenance: MaintenanceEntity): Promise<void> {
    await this.sequelize.transaction(async (t) => {
      await MaintenanceModel.upsert(
        {
          id: maintenance.id,
          motorcycleId: maintenance.motorcycleId,
          maintenanceDate: maintenance.maintenanceDate,
          maintenanceType: maintenance.maintenanceType.value,
          description: maintenance.description,
          techniciansRecommendation: maintenance.techniciansRecommendation,
          currentMotorcycleMileage: maintenance.currentMotorcycleMileage.value,
          breakdownId: maintenance.breakdownId,
          maintenanceRecursionId: maintenance.maintenanceRecursionId,
        },
        { transaction: t }
      );

      for (const part of maintenance.replaceParts) {
        await ReplacedPartModel.upsert(
          {
            id: part.id,
            maintenanceId: part.maintenanceId,
            sparePartId: part.sparePartId,
            quantity: part.quantity,
          },
          { transaction: t }
        );
      }
    });
  }

  async findById(id: string): Promise<MaintenanceEntity | null> {
    if (!IdValidator.isValid(id)) {
      return null;
    }

    const maintenance = await MaintenanceModel.findByPk(id);
    if (!maintenance) {
      return null;
    }

    const replacedParts = await this.getReplacedParts(id);
    const mileage = Mileage.from(maintenance.currentMotorcycleMileage);
    const maintenanceType = MaintenanceType.from(maintenance.maintenanceType);

    if (mileage instanceof Error || maintenanceType instanceof Error) {
      throw new Error("Invalid data in database");
    }

    return MaintenanceEntity.restore(
      maintenance.id,
      maintenance.motorcycleId,
      maintenance.maintenanceDate,
      maintenanceType,
      maintenance.description,
      maintenance.techniciansRecommendation,
      mileage,
      replacedParts,
      maintenance.breakdownId,
      maintenance.maintenanceRecursionId
    );
  }

  async find(): Promise<MaintenanceEntity[]> {
    const maintenances = await MaintenanceModel.findAll();
    const result: MaintenanceEntity[] = [];

    for (const maintenance of maintenances) {
      const replacedParts = await this.getReplacedParts(maintenance.id);
      const mileage = Mileage.from(maintenance.currentMotorcycleMileage);
      const maintenanceType = MaintenanceType.from(maintenance.maintenanceType);

      if (mileage instanceof Error || maintenanceType instanceof Error) {
        throw new Error("Invalid data in database");
      }

      result.push(
        MaintenanceEntity.restore(
          maintenance.id,
          maintenance.motorcycleId,
          maintenance.maintenanceDate,
          maintenanceType,
          maintenance.description,
          maintenance.techniciansRecommendation,
          mileage,
          replacedParts,
          maintenance.breakdownId,
          maintenance.maintenanceRecursionId
        )
      );
    }

    return result;
  }

  async findByMotorcycle(motorcycleId: string): Promise<MaintenanceEntity[]> {
    const maintenances = await MaintenanceModel.findAll({
      where: { motorcycleId },
    });
    const result: MaintenanceEntity[] = [];

    for (const maintenance of maintenances) {
      const replacedParts = await this.getReplacedParts(maintenance.id);
      const mileage = Mileage.from(maintenance.currentMotorcycleMileage);
      const maintenanceType = MaintenanceType.from(maintenance.maintenanceType);

      if (mileage instanceof Error || maintenanceType instanceof Error) {
        throw new Error("Invalid data in database");
      }

      result.push(
        MaintenanceEntity.restore(
          maintenance.id,
          maintenance.motorcycleId,
          maintenance.maintenanceDate,
          maintenanceType,
          maintenance.description,
          maintenance.techniciansRecommendation,
          mileage,
          replacedParts,
          maintenance.breakdownId,
          maintenance.maintenanceRecursionId
        )
      );
    }

    return result;
  }

  async findByBreakdown(
    breakdownId: string
  ): Promise<MaintenanceEntity | null> {
    const maintenance = await MaintenanceModel.findOne({
      where: { breakdownId },
    });
    if (!maintenance) {
      return null;
    }

    const replacedParts = await this.getReplacedParts(maintenance.id);
    const mileage = Mileage.from(maintenance.currentMotorcycleMileage);
    const maintenanceType = MaintenanceType.from(maintenance.maintenanceType);

    if (mileage instanceof Error || maintenanceType instanceof Error) {
      throw new Error("Invalid data in database");
    }

    return MaintenanceEntity.restore(
      maintenance.id,
      maintenance.motorcycleId,
      maintenance.maintenanceDate,
      maintenanceType,
      maintenance.description,
      maintenance.techniciansRecommendation,
      mileage,
      replacedParts,
      maintenance.breakdownId,
      maintenance.maintenanceRecursionId
    );
  }
}
