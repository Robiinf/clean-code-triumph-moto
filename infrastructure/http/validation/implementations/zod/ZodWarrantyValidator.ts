import { z } from "zod";
import {
  ValidatorInterface,
  ValidationResult,
} from "../../ValidationInterface";
import { CreateWarrantySchema } from "../../schemas/warranty.schema";

export class ZodWarrantyValidator
  implements ValidatorInterface<CreateWarrantySchema>
{
  private schema = z.object({
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    warrantyType: z.string().min(1),
    motorcyleId: z.string().uuid(),
    warrantyDescription: z.string().min(1),
  });

  async validate(
    data: unknown
  ): Promise<ValidationResult<CreateWarrantySchema>> {
    try {
      const validatedData = this.schema.parse(data) as CreateWarrantySchema;
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
