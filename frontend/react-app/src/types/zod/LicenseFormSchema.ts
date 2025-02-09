import { z } from "zod";

export const LicenseFormSchema = z.object({
  licenseNumber: z.string().nonempty(),
  issueDate: z.string(),
  expirationDate: z.string(),
  status: z.string(),
  categories: z.array(z.string()),
  driverId: z.string().uuid(),
});
