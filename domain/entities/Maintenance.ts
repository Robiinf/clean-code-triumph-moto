import { MaintenanceType } from "../types/maintenance-type";
import { Mileage } from "../types/mileage";
import { ReplacedPart } from "../types/replaced-part";
import { Motorcycle } from "./Motorcycle";

export class Maintenance {
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

    public motorcycle?: Motorcycle
  ) {}
}
