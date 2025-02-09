import { z } from "zod";

export const DriverFormSchema = z.object({
  firstName: z.string().nonempty(),
  lastName: z.string().nonempty(),
  phone: z.string().min(10).max(10),
  email: z.string().email(),
  birthDate: z.string(),
  companyId: z.string().nonempty().uuid(),
});
