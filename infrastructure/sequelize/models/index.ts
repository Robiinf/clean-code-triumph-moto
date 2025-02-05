import { Sequelize } from "sequelize";
import { TestDriveModel } from "./TestDriveModel";
import { BreakdownModel } from "./BreakdownModel";
import { WarrantyModel } from "./WarrantyModel";
import { RentalModel } from "./RentalModel";

export const initializeModels = (sequelize: Sequelize): void => {
  TestDriveModel.initModel(sequelize);
  BreakdownModel.initModel(sequelize);
  WarrantyModel.initModel(sequelize);
  RentalModel.initModel(sequelize);
};

export const synchronizeModels = async (
  sequelize: Sequelize
): Promise<void> => {
  const modelSyncOrder = [
    TestDriveModel,
    BreakdownModel,
    WarrantyModel,
    RentalModel,
  ];

  for (const model of modelSyncOrder) {
    await model.sync({ force: false });
  }
};
