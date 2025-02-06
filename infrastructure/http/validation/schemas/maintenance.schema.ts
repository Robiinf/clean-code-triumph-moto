export interface CreateMaintenanceSchema {
  motorcycleId: string;
  maintenanceDate: string;
  maintenanceType: string;
  description: string;
  techniciansRecommendation: string;
  replacedParts: {
    sparePartId: string;
    quantity: number;
  }[];
  breakdownId?: string;
  maintenanceRecursionId?: string;
}
