import { z } from "zod";
import {
  ValidatorInterface,
  ValidationResult,
} from "../../ValidationInterface";
import { CreateOrderSchema } from "../../schemas/order.schema";

export class ZodOrderValidator
  implements ValidatorInterface<CreateOrderSchema>
{
  private schema = z.object({
    orderLines: z
      .array(
        z.object({
          sparePartId: z.string().uuid(),
          quantity: z.number().int().positive(),
        })
      )
      .min(1),
  });

  async validate(data: unknown): Promise<ValidationResult<CreateOrderSchema>> {
    try {
      const validatedData = this.schema.parse(data) as CreateOrderSchema;
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
