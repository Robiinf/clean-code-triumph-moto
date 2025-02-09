import { z } from "zod";

export const TestSessionFormSchema = z.object({
  motorcycleId: z.string().uuid(),
  driverId: z.string().uuid(),
  sessionDate: z.string(),
  sessionDetails: z.string().min(0).max(200),
});
