import { Sequelize, Op } from "sequelize";
import { SparePartRepository } from "../../../application/repositories/SparePartRepository";
import { SparePartEntity } from "../../../domain/entities/SparePartEntity";
import { IdValidator } from "../../utils/IdValidator";
import { SparePartModel } from "../models/SparePartModel";

export class SequelizeSparePartRepository implements SparePartRepository {
  constructor(private sequelize: Sequelize) {
    SparePartModel.initModel(sequelize);
  }

  private toEntity(sparePart: SparePartModel): SparePartEntity {
    return new SparePartEntity(
      sparePart.id,
      sparePart.name,
      sparePart.unitPrice,
      sparePart.description,
      sparePart.stockQuantity,
      sparePart.alertLowStock
    );
  }

  async save(sparePart: SparePartEntity): Promise<void> {
    const data = {
      id: sparePart.id,
      name: sparePart.name,
      unitPrice: sparePart.unitPrice,
      description: sparePart.description,
      stockQuantity: sparePart.stockQuantity,
      alertLowStock: sparePart.alertLowStock,
    };

    await SparePartModel.upsert(data);
  }

  async findAll(): Promise<SparePartEntity[]> {
    const spareParts = await SparePartModel.findAll();
    return spareParts.map((sparePart) => this.toEntity(sparePart));
  }

  async findById(id: string): Promise<SparePartEntity | null> {
    if (!IdValidator.isValid(id)) {
      return null;
    }

    const sparePart = await SparePartModel.findByPk(id);
    return sparePart ? this.toEntity(sparePart) : null;
  }

  async delete(id: string): Promise<void> {
    if (!IdValidator.isValid(id)) {
      return;
    }

    await SparePartModel.destroy({
      where: {
        id,
      },
    });
  }

  async updateStockQuantity(id: string, quantity: number): Promise<void> {
    if (!IdValidator.isValid(id)) {
      return;
    }

    await SparePartModel.update(
      { stockQuantity: quantity },
      {
        where: {
          id,
        },
      }
    );
  }

  async updateAlertLowStock(id: string, quantity: number): Promise<void> {
    if (!IdValidator.isValid(id)) {
      return;
    }

    await SparePartModel.update(
      { alertLowStock: quantity },
      {
        where: {
          id,
        },
      }
    );
  }

  async findLowStock(): Promise<SparePartEntity[]> {
    const spareParts = await SparePartModel.findAll({
      where: {
        stockQuantity: {
          [Op.lte]: Sequelize.col("alertLowStock"),
        },
      },
    });

    return spareParts.map((sparePart) => this.toEntity(sparePart));
  }

  async findByName(name: string): Promise<SparePartEntity[]> {
    const spareParts = await SparePartModel.findAll({
      where: {
        name: {
          [Op.iLike]: `%${name}%`,
        },
      },
    });

    return spareParts.map((sparePart) => this.toEntity(sparePart));
  }
}
