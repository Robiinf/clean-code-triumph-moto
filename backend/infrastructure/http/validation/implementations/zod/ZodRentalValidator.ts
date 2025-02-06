import { z } from "zod";
import {
  ValidatorInterface,
  ValidationResult,
} from "../../ValidationInterface";
import { CreateRentalSchema } from "../../schemas/rental.schema";

export class ZodRentalValidator
  implements ValidatorInterface<CreateRentalSchema>
{
  private schema = z.object({
    motorcycleId: z.string().uuid(),
    renterId: z.string().uuid(),
    rentalStartDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    rentalEndDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    dailyRate: z.number().positive(),
    returnDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .nullable()
      .optional(),
  });

  async validate(data: unknown): Promise<ValidationResult<CreateRentalSchema>> {
    try {
      const validatedData = this.schema.parse(data) as CreateRentalSchema;
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
