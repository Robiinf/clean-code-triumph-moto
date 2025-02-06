import { Model, DataTypes, Sequelize } from "sequelize";

export class OrderLineModel extends Model {
  public id!: string;
  public orderId!: string;
  public sparePartId!: string;
  public quantity!: number;
  public unitPrice!: number;

  static initModel(sequelize: Sequelize): void {
    OrderLineModel.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          allowNull: false,
        },
        orderId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "orders",
            key: "id",
          },
        },
        sparePartId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "spare_parts",
            key: "id",
          },
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        unitPrice: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "order_lines",
        timestamps: false,
      }
    );
  }
}
