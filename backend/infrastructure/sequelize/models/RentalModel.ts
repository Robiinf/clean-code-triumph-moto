// src/infrastructure/sequelize/models/express/RentalModel.ts
import { Model, DataTypes, Sequelize } from "sequelize";

export class RentalModel extends Model {
  public id!: string;
  public motorcycleId!: string;
  public renterId!: string;
  public rentalStartDate!: Date;
  public rentalEndDate!: Date;
  public dailyRate!: number;
  public rentalStatus!: string;
  public returnDate!: Date | null;

  static initModel(sequelize: Sequelize): void {
    RentalModel.init(
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
        renterId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        rentalStartDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        rentalEndDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        dailyRate: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        rentalStatus: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        returnDate: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "rentals",
        timestamps: false,
      }
    );
  }
}
