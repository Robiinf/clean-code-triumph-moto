import { Model, DataTypes, Sequelize } from "sequelize";

export class MaintenanceRecursionModel extends Model {
  public id!: string;
  public motorcycleId!: string;
  public description!: string;
  public intervalKm!: number | null;
  public intervalMonths!: number | null;

  static initModel(sequelize: Sequelize): void {
    MaintenanceRecursionModel.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          allowNull: false,
        },
        motorcycleId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "motorcycles",
            key: "id",
          },
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        intervalKm: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        intervalMonths: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "maintenance_recursions",
        timestamps: false,
      }
    );
  }
}
