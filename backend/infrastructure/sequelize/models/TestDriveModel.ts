import { Model, DataTypes, Sequelize } from "sequelize";

export class TestDriveModel extends Model {
  public id!: string;
  public motorcycleId!: string;
  public driverId!: string;
  public sessionDate!: Date;
  public sessionDetails!: string;

  static initModel(sequelize: Sequelize): void {
    TestDriveModel.init(
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
        driverId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        sessionDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        sessionDetails: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "test_drives",
        timestamps: false,
      }
    );
  }
}
