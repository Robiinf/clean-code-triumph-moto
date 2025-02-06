import { Sequelize } from "sequelize";
import { BreakdownRepository } from "../../../application/repositories/BreakdownRepository";
import { BreakdownEntity } from "../../../domain/entities/BreakdownEntity";
import { BreakdownModel } from "../models/BreakdownModel";
import { IdValidator } from "../../utils/IdValidator";
import { BreakdownType } from "../../../domain/types/BreakdownType";

export class SequelizeBreakdownRepository implements BreakdownRepository {
  constructor(private sequelize: Sequelize) {
    BreakdownModel.initModel(sequelize);
  }

  private toEntity(breakdown: BreakdownModel): BreakdownEntity {
    const checkedBreakdownType = BreakdownType.from(breakdown.breakdownType);
    if (checkedBreakdownType instanceof Error) {
      throw new Error("Invalid breakdown type");
    }

    return new BreakdownEntity(
      breakdown.id,
      breakdown.breakdownDate,
      checkedBreakdownType,
      breakdown.breakdownDescription,
      breakdown.motorcycleId
    );
  }

  async save(breakdown: BreakdownEntity): Promise<void> {
    const data = {
      id: breakdown.id,
      breakdownDate: breakdown.breakdownDate,
      breakdownType: breakdown.breakdownType.value,
      breakdownDescription: breakdown.breakdownDescription,
      motorcycleId: breakdown.motorcycleId,
    };
    await BreakdownModel.upsert(data);
  }

  async findByVehicleId(motorcycleId: string): Promise<BreakdownEntity[]> {
    if (!IdValidator.isValid(motorcycleId)) {
      return [];
    }

    const breakdowns = await BreakdownModel.findAll({
      where: { motorcycleId },
    });
    return breakdowns.map((breakdown) => this.toEntity(breakdown));
  }
}
