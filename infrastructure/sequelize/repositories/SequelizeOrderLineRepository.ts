// src/infrastructure/sequelize/repositories/SequelizeOrderLineRepository.ts
import { Sequelize } from "sequelize";
import { OrderLineRepository } from "../../../application/repositories/OrderLineRepository";
import { OrderLineEntity } from "../../../domain/entities/OrderLineEntity";
import { OrderLineModel } from "../models/OrderLineModel";
import { IdValidator } from "../../utils/IdValidator";

export class SequelizeOrderLineRepository implements OrderLineRepository {
  constructor(private sequelize: Sequelize) {
    OrderLineModel.initModel(sequelize);
  }

  async save(orderLine: OrderLineEntity): Promise<void> {
    await OrderLineModel.upsert({
      id: orderLine.id,
      orderId: orderLine.orderId,
      sparePartId: orderLine.sparePartId,
      quantity: orderLine.quantity,
      unitPrice: orderLine.unitPrice,
    });
  }

  async findByOrder(orderId: string): Promise<OrderLineEntity[]> {
    if (!IdValidator.isValid(orderId)) {
      return [];
    }

    const lines = await OrderLineModel.findAll({ where: { orderId } });
    return lines.map((line) =>
      OrderLineEntity.create(
        line.orderId,
        line.sparePartId,
        line.quantity,
        line.unitPrice
      )
    );
  }

  async findBySparePart(sparePartId: string): Promise<OrderLineEntity[]> {
    if (!IdValidator.isValid(sparePartId)) {
      return [];
    }

    const lines = await OrderLineModel.findAll({ where: { sparePartId } });
    return lines.map((line) =>
      OrderLineEntity.create(
        line.orderId,
        line.sparePartId,
        line.quantity,
        line.unitPrice
      )
    );
  }
}
