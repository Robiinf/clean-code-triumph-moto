import { Model, DataTypes, Sequelize } from "sequelize";

export class SparePartModel extends Model {
  public id!: string;
  public name!: string;
  public unitPrice!: number;
  public description!: string;
  public stockQuantity!: number;
  public alertLowStock!: number;

  static initModel(sequelize: Sequelize): void {
    SparePartModel.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        unitPrice: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        stockQuantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        alertLowStock: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "spare_parts",
        timestamps: false,
      }
    );
  }
}
