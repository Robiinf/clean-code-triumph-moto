import { ReplaceParts } from "./ReplacedPart";

export interface Maintenance {
  id: string;
  motorcycleId: string;
  maintenanceDate: Date;
  maintenanceType: { value: string };
  description: string;
  techniciansRecommendation: string;
  currentMotorcycleMileage: { value: number };
  replaceParts: ReplaceParts[];
  breakdownId?: string;
  maintenanceRecursionId?: string;
}
