// src/infrastructure/http/validation/implementations/zod/ZodDriverLicenseValidator.ts
import { z } from "zod";
import {
  ValidatorInterface,
  ValidationResult,
} from "../../ValidationInterface";
import { CreateDriverLicenseSchema } from "../../schemas/driverLicense.schema";

export class ZodDriverLicenseValidator
  implements ValidatorInterface<CreateDriverLicenseSchema>
{
  private schema = z.object({
    licenseNumber: z.string().min(1),
    issueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    expirationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    status: z.string().min(1),
    categories: z.array(z.string()),
    driverId: z.string().uuid(),
  });

  async validate(
    data: unknown
  ): Promise<ValidationResult<CreateDriverLicenseSchema>> {
    try {
      const validatedData = this.schema.parse(
        data
      ) as CreateDriverLicenseSchema;
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
