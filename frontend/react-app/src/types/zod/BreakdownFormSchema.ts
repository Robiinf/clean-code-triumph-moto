import { z } from "zod";

export const BreakdownformSchema = z.object({
  breakdownDate: z.string(),
  breakdownType: z.string(),
  breakdownDescription: z.string().min(0).max(200),
  motorcycleId: z.string(),
});
