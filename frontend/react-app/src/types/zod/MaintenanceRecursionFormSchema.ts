import { z } from "zod";

export const MaintenanceRecursionFormSchema = z.object({
  motorcycleId: z.string().uuid(),
  description: z.string().nonempty(),
  intervalKm: z.number().positive(),
  intervalMonths: z.number().positive(),
});
