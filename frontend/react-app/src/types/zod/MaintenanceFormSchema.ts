import { z } from "zod";

export const MaintenanceformSchema = z.object({
  motorcycleId: z.string().min(2).max(50),
  breakdownId: z.string().optional(),
  maintenanceType: z.string().min(2).max(50),
  maintenanceDate: z.string(),
  description: z.string().min(0).max(50),
  techniciansRecommendation: z.string().min(0).max(50),
  currentMotorcycleMileage: z.coerce.number().int().positive(),
});
