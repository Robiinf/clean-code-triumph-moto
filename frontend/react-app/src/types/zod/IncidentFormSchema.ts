import { z } from "zod";

export const IncidentFormSchema = z.object({
  driverId: z.string().nonempty().uuid(),
  motorcycleId: z.string().nonempty().uuid(),
  incidentDate: z.string().nonempty(),
  incidentDetails: z.string().nonempty(),
});
