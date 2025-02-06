import { Model, DataTypes, Sequelize } from "sequelize";

export class BreakdownModel extends Model {
  public id!: string;
  public breakdownDate!: Date;
  public breakdownType!: string;
  public breakdownDescription!: string;
  public motorcycleId!: string;

  public static initModel(sequelize: Sequelize): void {
    BreakdownModel.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
        },
        breakdownDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        breakdownType: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        breakdownDescription: {
          type: DataTypes.STRING,
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
      },
      {
        sequelize,
        tableName: "breakdowns",
        timestamps: false,
      }
    );
  }
}
