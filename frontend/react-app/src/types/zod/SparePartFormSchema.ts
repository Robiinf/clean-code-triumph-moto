import { z } from "zod";

export const SparePartformSchema = z.object({
  name: z.string().min(2).max(50),
  unitPrice: z.coerce.number().positive(),
  description: z.string().min(0).max(50),
  stockQuantity: z.coerce.number().int().positive(),
  alertLowStock: z.coerce.number().int().positive(),
});
