import { z } from "zod";

export const MaintenanceSparePartformSchema = z.object({
  replacedParts: z
    .array(
      z.object({
        sparePartId: z.string().min(2, "Sélectionnez une pièce").max(50),
        quantity: z.coerce
          .number()
          .int()
          .positive("Doit être un nombre positif"),
      })
    )
    .min(1, "Ajoutez au moins une commande"),
});
