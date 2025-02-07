import { z } from "zod";

export const MaintenanceformSchema = z.object({
  motorcycleId: z.string().min(2).max(50),
  maintenanceType: z.string().min(2).max(50),
  maintenanceDate: z.string(),
  description: z.string().min(0).max(50),
  techniciansRecommendation: z.string().min(0).max(50),
  currentMotorcycleMileage: z.number().int().positive(),
});
