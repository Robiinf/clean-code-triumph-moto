import { MaintenanceType } from "../types/maintenance-type";
import { Mileage } from "../types/mileage";
import { ReplacedPart } from "../types/replaced-part";
import { MotorcycleEntity } from "./MotorcycleEntity";

export class MaintenanceEntity {
  constructor(
    public id: string,
    public date: Date,
    public type: MaintenanceType,
    public recommendation: string,
    public motorcycle_id: string,
    public mileage: Mileage,
    public replace_parts: ReplacedPart[],
    public breakdown_id?: string,
    public technician_fullname?: string,

    public motorcycle?: MotorcycleEntity
  ) {}

  public static create(
    date: Date,
    type: MaintenanceType,
    recommendation: string,
    motorcycle_id: string,
    mileage: Mileage,
    replace_parts: ReplacedPart[],
    breakdown_id?: string,
    technician_fullname?: string
  ): MaintenanceEntity {
    const id = crypto.randomUUID();
    return new MaintenanceEntity(
      id,
      date,
      type,
      recommendation,
      motorcycle_id,
      mileage,
      replace_parts,
      breakdown_id,
      technician_fullname
    );
  }
}
