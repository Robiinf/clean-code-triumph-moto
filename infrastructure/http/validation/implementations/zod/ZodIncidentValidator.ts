// src/infrastructure/http/validation/implementations/zod/ZodIncidentValidator.ts
import { z } from "zod";
import {
  ValidatorInterface,
  ValidationResult,
} from "../../ValidationInterface";
import { CreateIncidentSchema } from "../../schemas/incident.schema";

export class ZodIncidentValidator
  implements ValidatorInterface<CreateIncidentSchema>
{
  private schema = z.object({
    driverId: z.string().uuid(),
    motorcycleId: z.string().uuid(),
    incidentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    incidentDetails: z.string().min(1),
  });

  async validate(
    data: unknown
  ): Promise<ValidationResult<CreateIncidentSchema>> {
    try {
      const validatedData = this.schema.parse(data) as CreateIncidentSchema;
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
