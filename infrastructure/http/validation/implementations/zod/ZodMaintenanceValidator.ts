import { z } from "zod";
import {
  ValidatorInterface,
  ValidationResult,
} from "../../ValidationInterface";
import { CreateMaintenanceSchema } from "../../schemas/maintenance.schema";

export class ZodMaintenanceValidator
  implements ValidatorInterface<CreateMaintenanceSchema>
{
  private schema = z.object({
    motorcycleId: z.string().uuid(),
    maintenanceDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    maintenanceType: z.string(),
    description: z.string().min(1),
    techniciansRecommendation: z.string().min(1),
    replacedParts: z
      .array(
        z.object({
          sparePartId: z.string().uuid(),
          quantity: z.number().positive(),
        })
      )
      .default([]),
    breakdownId: z.string().uuid().optional(),
    maintenanceRecursionId: z.string().uuid().optional(),
  });

  async validate(
    data: unknown
  ): Promise<ValidationResult<CreateMaintenanceSchema>> {
    try {
      const validatedData = this.schema.parse(data) as CreateMaintenanceSchema;
      return {
        success: true,
        data: validatedData,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          errors: error.errors.map((err) => err.message),
        };
      }
      return {
        success: false,
        errors: ["Validation failed"],
      };
    }
  }
}
