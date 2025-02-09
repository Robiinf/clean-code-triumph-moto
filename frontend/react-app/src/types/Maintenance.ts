import { ReplacedParts } from "./ReplacedPart";

export interface Maintenance {
  id: string;
  motorcycleId: string;
  maintenanceDate: Date;
  maintenanceType: { value: string };
  description: string;
  techniciansRecommendation: string;
  currentMotorcycleMileage: { value: number };
  breakdownId?: string;
  maintenanceRecursionId?: string;
  replacedParts: ReplacedParts[];
}
