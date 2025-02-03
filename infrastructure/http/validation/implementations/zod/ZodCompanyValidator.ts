// src/infrastructure/http/validation/implementations/zod/ZodCompanyValidator.ts
import { z } from "zod";
import {
  ValidatorInterface,
  ValidationResult,
} from "../../ValidationInterface";
import { CreateCompanySchema } from "../../schemas/company.schema";

export class ZodCompanyValidator
  implements ValidatorInterface<CreateCompanySchema>
{
  private schema = z.object({
    name: z.string().min(1),
    siret: z.string().min(1),
    phone: z.string().min(1),
    address: z.string().min(1),
    city: z.string().min(1),
    postalCode: z.string().min(1),
    country: z.string().min(1),
  });

  async validate(
    data: unknown
  ): Promise<ValidationResult<CreateCompanySchema>> {
    try {
      const validatedData = this.schema.parse(data) as CreateCompanySchema;
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
