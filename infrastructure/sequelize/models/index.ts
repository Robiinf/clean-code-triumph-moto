import { Sequelize } from "sequelize";
import { TestDriveModel } from "./TestDriveModel";
import { BreakdownModel } from "./BreakdownModel";
import { WarrantyModel } from "./WarrantyModel";
import { RentalModel } from "./RentalModel";
import { SparePartModel } from "./SparePartModel";
import { OrderModel } from "./OrderModel";
import { OrderLineModel } from "./OrderLineModel";
import { MaintenanceRecursionModel } from "./MaintenanceRecursionModel";

export const initializeModels = (sequelize: Sequelize): void => {
  TestDriveModel.initModel(sequelize);
  BreakdownModel.initModel(sequelize);
  WarrantyModel.initModel(sequelize);
  RentalModel.initModel(sequelize);
  SparePartModel.initModel(sequelize);
  OrderModel.initModel(sequelize);
  OrderLineModel.initModel(sequelize);
  MaintenanceRecursionModel.initModel(sequelize);
};

export const synchronizeModels = async (
  sequelize: Sequelize
): Promise<void> => {
  const modelSyncOrder = [
    TestDriveModel,
    BreakdownModel,
    WarrantyModel,
    RentalModel,
    SparePartModel,
    OrderModel,
    OrderLineModel,
    MaintenanceRecursionModel,
  ];

  for (const model of modelSyncOrder) {
    await model.sync({ force: false });
  }
};
