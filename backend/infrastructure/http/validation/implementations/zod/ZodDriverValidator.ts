import { z } from "zod";
import {
  ValidatorInterface,
  ValidationResult,
} from "../../ValidationInterface";
import { CreateDriverSchema } from "../../schemas/driver.schema";

export class ZodDriverValidator implements ValidatorInterface<CreateDriverSchema> {
  private schema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    phone: z.string().min(1),
    email: z.string().email(),
    birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    companyId: z.string().uuid(),
  });

  async validate(data: unknown): Promise<ValidationResult<CreateDriverSchema>> {
    try {
      const validatedData = this.schema.parse(data) as CreateDriverSchema;
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
