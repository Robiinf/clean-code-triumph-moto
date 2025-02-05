import { Sequelize } from "sequelize";
import { MaintenanceRecursionRepository } from "../../../application/repositories/MaintenanceRecursionRepository";
import { MaintenanceRecursionEntity } from "../../../domain/entities/MaintenanceRecursionEntity";
import { MaintenanceRecursionModel } from "../models/MaintenanceRecursionModel";
import { IdValidator } from "../../utils/IdValidator";

export class SequelizeMaintenanceRecursionRepository
  implements MaintenanceRecursionRepository
{
  constructor(private sequelize: Sequelize) {
    MaintenanceRecursionModel.initModel(sequelize);
  }

  async save(maintenanceRecursion: MaintenanceRecursionEntity): Promise<void> {
    await MaintenanceRecursionModel.upsert({
      id: maintenanceRecursion.id,
      motorcycleId: maintenanceRecursion.motorcycleId,
      description: maintenanceRecursion.description,
      intervalKm: maintenanceRecursion.intervalKm,
      intervalMonths: maintenanceRecursion.intervalMonths,
    });
  }

  async findById(id: string): Promise<MaintenanceRecursionEntity | null> {
    if (!IdValidator.isValid(id)) {
      return null;
    }

    const maintenance = await MaintenanceRecursionModel.findOne({
      where: { id },
    });
    if (!maintenance) {
      return null;
    }

    return MaintenanceRecursionEntity.restore(
      maintenance.id,
      maintenance.motorcycleId,
      maintenance.description,
      maintenance.intervalKm,
      maintenance.intervalMonths
    );
  }

  async findByMotorcycle(
    motorcycleId: string
  ): Promise<MaintenanceRecursionEntity[]> {
    if (!IdValidator.isValid(motorcycleId)) {
      return [];
    }

    const maintenances = await MaintenanceRecursionModel.findAll({
      where: { motorcycleId },
    });

    return maintenances.map((maintenance) =>
      MaintenanceRecursionEntity.restore(
        maintenance.id,
        maintenance.motorcycleId,
        maintenance.description,
        maintenance.intervalKm,
        maintenance.intervalMonths
      )
    );
  }

  async delete(id: string): Promise<void> {
    await MaintenanceRecursionModel.destroy({ where: { id } });
  }
}
