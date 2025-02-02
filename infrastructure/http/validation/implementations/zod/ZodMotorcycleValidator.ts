// src/infrastructure/http/validation/implementations/zod/ZodMotorcycleValidator.ts
import { z } from "zod";
import {
  ValidatorInterface,
  ValidationResult,
} from "../../ValidationInterface";
import { CreateMotorcycleSchema } from "../../schemas/motorcycle.schema";

export class ZodMotorcycleValidator
  implements ValidatorInterface<CreateMotorcycleSchema>
{
  private schema = z.object({
    vin: z.string().min(1),
    model: z.string().min(1),
    year: z.number().int().positive(),
    status: z.string().min(1),
    mileageInKilometers: z.number().nonnegative(),
    motorcycleType: z.string().min(1),
    power: z.number().positive(),
    fuelType: z.string().min(1),
    transmission: z.string().min(1),
    fuelTankCapacityInLiters: z.number().positive(),
  });

  async validate(
    data: unknown
  ): Promise<ValidationResult<CreateMotorcycleSchema>> {
    try {
      const validatedData = this.schema.parse(data) as CreateMotorcycleSchema;
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
