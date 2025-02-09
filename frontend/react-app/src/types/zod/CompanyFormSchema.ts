import { z } from "zod";

export const CompanyformSchema = z.object({
  name: z.string().nonempty(),
  siret: z.string().min(14).max(14),
  phone: z.string().min(10).max(10),
  address: z.string().nonempty(),
  city: z.string().nonempty(),
  postalCode: z.string().min(5).max(5),
  country: z.string().nonempty(),
});
