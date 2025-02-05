import { Sequelize } from "sequelize";
import { WarrantyRepository } from "../../../application/repositories/WarrantyRepository";
import { WarrantyEntity } from "../../../domain/entities/WarrantyEntity";
import { WarrantyModel } from "../models/WarrantyModel";
import { IdValidator } from "../../utils/IdValidator";

export class SequelizeWarrantyRepository implements WarrantyRepository {
  constructor(private sequelize: Sequelize) {
    WarrantyModel.initModel(sequelize);
  }

  private toEntity(warranty: WarrantyModel): WarrantyEntity {
    return new WarrantyEntity(
      warranty.id,
      warranty.startDate,
      warranty.endDate,
      warranty.warrantyType,
      warranty.warrantyStatus,
      warranty.motorcyleId,
      warranty.warrantyDescription
    );
  }

  async findById(id: string): Promise<WarrantyEntity | null> {
    if (!IdValidator.isValid(id)) {
      return null;
    }

    const warranty = await WarrantyModel.findByPk(id);
    if (!warranty) {
      return null;
    }

    return this.toEntity(warranty);
  }

  async save(warranty: WarrantyEntity): Promise<void> {
    await WarrantyModel.upsert({
      id: warranty.id,
      startDate: warranty.startDate,
      endDate: warranty.endDate,
      warrantyType: warranty.warrantyType,
      warrantyStatus: warranty.warrantyStatus,
      motorcyleId: warranty.motorcyleId,
      warrantyDescription: warranty.warrantyDescription,
    });
  }

  async findByVehicle(vehicleId: string): Promise<WarrantyEntity[]> {
    if (!IdValidator.isValid(vehicleId)) {
      return [];
    }

    const warranties = await WarrantyModel.findAll({
      where: { motorcyleId: vehicleId },
    });

    return warranties.map((warranty) => this.toEntity(warranty));
  }
}
