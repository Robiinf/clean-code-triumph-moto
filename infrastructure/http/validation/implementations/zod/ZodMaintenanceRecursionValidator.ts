import { z } from "zod";
import {
  ValidatorInterface,
  ValidationResult,
} from "../../ValidationInterface";
import { CreateMaintenanceRecursionSchema } from "../../schemas/maintenanceRecursion.schema";

export class ZodMaintenanceRecursionValidator
  implements ValidatorInterface<CreateMaintenanceRecursionSchema>
{
  private schema = z
    .object({
      motorcycleId: z.string().uuid(),
      description: z.string().min(1),
      intervalKm: z.number().positive().nullable(),
      intervalMonths: z.number().positive().nullable(),
    })
    .refine(
      (data) => data.intervalKm !== null || data.intervalMonths !== null,
      {
        message: "At least one interval (km or months) must be specified",
      }
    );

  async validate(
    data: unknown
  ): Promise<ValidationResult<CreateMaintenanceRecursionSchema>> {
    try {
      const validatedData = this.schema.parse(
        data
      ) as CreateMaintenanceRecursionSchema;
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
