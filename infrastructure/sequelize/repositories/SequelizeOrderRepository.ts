import { Sequelize } from "sequelize";
import { OrderRepository } from "../../../application/repositories/OrderRepository";
import { OrderEntity, OrderStatus } from "../../../domain/entities/OrderEntity";
import { OrderModel } from "../models/OrderModel";
import { OrderLineModel } from "../models/OrderLineModel";
import { OrderLineEntity } from "../../../domain/entities/OrderLineEntity";
import { IdValidator } from "../../utils/IdValidator";

export class SequelizeOrderRepository implements OrderRepository {
  constructor(private sequelize: Sequelize) {
    OrderModel.initModel(sequelize);
    OrderLineModel.initModel(sequelize);
  }

  async save(order: OrderEntity): Promise<void> {
    await this.sequelize.transaction(async (t) => {
      await OrderModel.upsert(
        {
          id: order.id,
          orderDate: order.orderDate,
          status: order.status,
          totalAmount: order.totalAmount,
        },
        { transaction: t }
      );

      for (const line of order.orderLines) {
        await OrderLineModel.upsert(
          {
            id: line.id,
            orderId: line.orderId,
            sparePartId: line.sparePartId,
            quantity: line.quantity,
            unitPrice: line.unitPrice,
          },
          { transaction: t }
        );
      }
    });
  }

  private async getOrderLines(orderId: string): Promise<OrderLineEntity[]> {
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

  async findById(id: string): Promise<OrderEntity | null> {
    if (!IdValidator.isValid(id)) {
      return null;
    }

    const order = await OrderModel.findOne({ where: { id } });
    if (!order) {
      return null;
    }

    const orderLines = await this.getOrderLines(id);
    return OrderEntity.restore(
      order.id,
      order.orderDate,
      order.status as OrderStatus,
      order.totalAmount,
      orderLines
    );
  }

  async findAll(): Promise<OrderEntity[]> {
    const orders = await OrderModel.findAll();
    const result: OrderEntity[] = [];

    for (const order of orders) {
      const orderLines = await this.getOrderLines(order.id);
      result.push(
        OrderEntity.restore(
          order.id,
          order.orderDate,
          order.status as OrderStatus,
          order.totalAmount,
          orderLines
        )
      );
    }

    return result;
  }

  async findByStatus(status: OrderStatus): Promise<OrderEntity[]> {
    const orders = await OrderModel.findAll({ where: { status } });
    const result: OrderEntity[] = [];

    for (const order of orders) {
      const orderLines = await this.getOrderLines(order.id);
      result.push(
        OrderEntity.restore(
          order.id,
          order.orderDate,
          order.status as OrderStatus,
          order.totalAmount,
          orderLines
        )
      );
    }

    return result;
  }

  async updateStatus(id: string, status: OrderStatus): Promise<void> {
    await OrderModel.update({ status }, { where: { id } });
  }
}
