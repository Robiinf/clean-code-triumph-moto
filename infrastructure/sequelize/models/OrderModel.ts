import { Model, DataTypes, Sequelize } from "sequelize";

export class OrderModel extends Model {
  public id!: string;
  public orderDate!: Date;
  public status!: string;
  public totalAmount!: number;

  static initModel(sequelize: Sequelize): void {
    OrderModel.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          allowNull: false,
        },
        orderDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        status: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        totalAmount: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "orders",
        timestamps: false,
      }
    );
  }
}
