import { z } from "zod";

export const WarrantyformSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
  warrantyType: z.string().min(2).max(50),
  motorcyleId: z.string().min(2).max(50),
  warrantyDescription: z.string().min(0).max(50),
});
