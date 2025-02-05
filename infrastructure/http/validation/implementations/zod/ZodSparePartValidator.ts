import { z } from "zod";
import {
  ValidatorInterface,
  ValidationResult,
} from "../../ValidationInterface";
import { CreateSparePartSchema } from "../../schemas/sparePart.schema";

export class ZodSparePartValidator
  implements ValidatorInterface<CreateSparePartSchema>
{
  private schema = z.object({
    name: z.string().min(1),
    unitPrice: z.number().positive(),
    description: z.string().min(1),
    stockQuantity: z.number().int().min(0),
    alertLowStock: z.number().int().min(0),
  });

  async validate(
    data: unknown
  ): Promise<ValidationResult<CreateSparePartSchema>> {
    try {
      const validatedData = this.schema.parse(data) as CreateSparePartSchema;
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
