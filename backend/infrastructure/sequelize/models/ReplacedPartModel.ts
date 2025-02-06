import { Model, DataTypes, Sequelize } from "sequelize";

export class ReplacedPartModel extends Model {
  public id!: string;
  public maintenanceId!: string;
  public sparePartId!: string;
  public quantity!: number;

  static initModel(sequelize: Sequelize): void {
    ReplacedPartModel.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          allowNull: false,
        },
        maintenanceId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "maintenances",
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
      },
      {
        sequelize,
        tableName: "replaced_parts",
        timestamps: false,
      }
    );
  }
}
