import { Model, DataTypes, Sequelize } from "sequelize";

export class WarrantyModel extends Model {
  public id!: string;
  public startDate!: Date;
  public endDate!: Date;
  public warrantyType!: string;
  public warrantyStatus!: string;
  public motorcyleId!: string;
  public warrantyDescription!: string;

  static initModel(sequelize: Sequelize): void {
    WarrantyModel.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          allowNull: false,
        },
        startDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        endDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        warrantyType: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        warrantyStatus: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        motorcyleId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "motorcycles",
            key: "id",
          },
        },
        warrantyDescription: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "warranties",
        timestamps: false,
      }
    );
  }
}
