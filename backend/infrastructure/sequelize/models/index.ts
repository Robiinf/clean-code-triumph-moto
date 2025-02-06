import { Sequelize } from "sequelize";
import { TestDriveModel } from "./TestDriveModel";
import { BreakdownModel } from "./BreakdownModel";
import { WarrantyModel } from "./WarrantyModel";
import { RentalModel } from "./RentalModel";
import { SparePartModel } from "./SparePartModel";
import { OrderModel } from "./OrderModel";
import { OrderLineModel } from "./OrderLineModel";
import { MaintenanceRecursionModel } from "./MaintenanceRecursionModel";
import { MaintenanceModel } from "./MaintenanceModel";
import { ReplacedPartModel } from "./ReplacedPartModel";

export const initializeModels = (sequelize: Sequelize): void => {
  TestDriveModel.initModel(sequelize);
  BreakdownModel.initModel(sequelize);
  WarrantyModel.initModel(sequelize);
  RentalModel.initModel(sequelize);
  SparePartModel.initModel(sequelize);
  OrderModel.initModel(sequelize);
  OrderLineModel.initModel(sequelize);
  MaintenanceRecursionModel.initModel(sequelize);
  MaintenanceModel.initModel(sequelize);
  ReplacedPartModel.initModel(sequelize);
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
    MaintenanceModel,
    ReplacedPartModel,
  ];

  for (const model of modelSyncOrder) {
    await model.sync({ force: false });
  }
};
