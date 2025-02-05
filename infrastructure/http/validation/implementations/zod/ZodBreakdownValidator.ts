import { z } from "zod";
import {
  ValidatorInterface,
  ValidationResult,
} from "../../ValidationInterface";
import { CreateBreakdownSchema } from "../../schemas/breakdown.schema";

export class ZodBreakdownValidator
  implements ValidatorInterface<CreateBreakdownSchema>
{
  private schema = z.object({
    breakdownDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    breakdownType: z.string().min(1),
    breakdownDescription: z.string().min(1),
    motorcycleId: z.string().uuid(),
  });

  async validate(
    data: unknown
  ): Promise<ValidationResult<CreateBreakdownSchema>> {
    try {
      const validatedData = this.schema.parse(data) as CreateBreakdownSchema;
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
