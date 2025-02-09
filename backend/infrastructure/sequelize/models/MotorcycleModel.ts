import { Model, DataTypes, Sequelize } from "sequelize";

export class MotorcycleModel extends Model {
  public id!: string;
  public vin!: string;
  public model!: string;
  public year!: number;
  public status!: string;
  public mileageInKilometers!: number;
  public motorcycleType!: string;
  public power!: number;
  public fuelType!: string;
  public transmission!: string;
  public fuelTankCapacityInLiters!: number;

  public static initModel(sequelize: Sequelize): void {
    MotorcycleModel.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
        },
        vin: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: false,
        },
        model: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        year: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        status: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        mileageInKilometers: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        motorcycleType: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        power: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        fuelType: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        transmission: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        fuelTankCapacityInLiters: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "motorcycles",
        timestamps: false,
      }
    );
  }
}
