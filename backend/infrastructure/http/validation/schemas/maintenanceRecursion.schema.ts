export interface CreateMaintenanceRecursionSchema {
  motorcycleId: string;
  description: string;
  intervalKm: number | null;
  intervalMonths: number | null;
}
