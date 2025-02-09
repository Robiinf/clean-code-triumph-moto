import { z } from "zod";

export const RentalFormSchema = z.object({
  motorcycleId: z.string().nonempty().uuid(),
  renterId: z.string().nonempty().uuid(),
  rentalStartDate: z.string().nonempty(),
  rentalEndDate: z.string().nonempty(),
  dailyRate: z.number().positive(),
});
