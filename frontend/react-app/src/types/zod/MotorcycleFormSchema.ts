import { z } from "zod";

export const MotorcycleformSchema = z.object({
  vin: z.string().min(17).max(17),
  model: z.string().min(2).max(50),
  year: z.coerce.number().int().positive(),
  status: z.string().min(2).max(50),
  mileageInKilometers: z.coerce.number().int().positive(),
  motorcycleType: z.string().min(2).max(50),
  power: z.coerce.number().int().positive(),
  fuelType: z.string().min(2).max(50),
  transmission: z.string().min(2).max(50),
  fuelTankCapacityInLiters: z.coerce.number().int().positive(),
});
