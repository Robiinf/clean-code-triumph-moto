import { z } from "zod";

export const ReturnRentalFormSchema = z.object({
  returnDate: z.string().nonempty("La date de retour est obligatoire"),
});
