import { Model, DataTypes, Sequelize } from "sequelize";

export class MaintenanceModel extends Model {
  public id!: string;
  public motorcycleId!: string;
  public maintenanceDate!: Date;
  public maintenancetype!: string;
  public description!: string;
  public techniciansRecommendation!: string;
  public currentMotorcycleMileage!: number;
  public breakdownId!: string | null;
  public maintenanceRecursionId!: string | null;

  static initModel(sequelize: Sequelize): void {
    MaintenanceModel.init(
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
        maintenanceDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        maintenancetype: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        techniciansRecommendation: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        currentMotorcycleMileage: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        breakdownId: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: "breakdowns",
            key: "id",
          },
        },
        maintenanceRecursionId: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: "maintenance_recursions",
            key: "id",
          },
        },
      },
      {
        sequelize,
        tableName: "maintenances",
        timestamps: false,
      }
    );
  }
}
