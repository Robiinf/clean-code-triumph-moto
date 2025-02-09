import { MaintenanceType } from "../types/MaintenanceType";
import { Mileage } from "../types/mileage";
import { ReplacedPartEntity } from "./ReplacedPartEntity";
import crypto from "crypto";

export class MaintenanceEntity {
  constructor(
    public id: string,
    public motorcycleId: string,
    public maintenanceDate: Date,
    public maintenanceType: MaintenanceType,
    public description: string,
    public techniciansRecommendation: string,
    public currentMotorcycleMileage: Mileage,
    public replacedParts: ReplacedPartEntity[],
    public breakdownId?: string,
    public maintenanceRecursionId?: string
  ) {}

  public static create(
    motorcycleId: string,
    maintenanceDate: Date,
    maintenanceType: MaintenanceType,
    description: string,
    techniciansRecommendation: string,
    currentMotorcycleMileage: Mileage,
    replacedParts: ReplacedPartEntity[],
    breakdownId?: string,
    maintenanceRecursionId?: string
  ): MaintenanceEntity {
    const id = crypto.randomUUID();
    return new MaintenanceEntity(
      id,
      motorcycleId,
      maintenanceDate,
      maintenanceType,
      description,
      techniciansRecommendation,
      currentMotorcycleMileage,
      replacedParts,
      breakdownId,
      maintenanceRecursionId
    );
  }

  public static restore(
    id: string,
    motorcycleId: string,
    maintenanceDate: Date,
    maintenanceType: MaintenanceType,
    description: string,
    techniciansRecommendation: string,
    currentMotorcycleMileage: Mileage,
    replacedParts: ReplacedPartEntity[],
    breakdownId?: string,
    maintenanceRecursionId?: string
  ): MaintenanceEntity {
    return new MaintenanceEntity(
      id,
      motorcycleId,
      maintenanceDate,
      maintenanceType,
      description,
      techniciansRecommendation,
      currentMotorcycleMileage,
      replacedParts,
      breakdownId,
      maintenanceRecursionId
    );
  }
}
