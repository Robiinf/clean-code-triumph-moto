import { z } from "zod";
import {
  ValidatorInterface,
  ValidationResult,
} from "../../ValidationInterface";
import { CreateTestDriveSchema } from "../../schemas/testDrive.schema";

export class ZodTestDriveValidator
  implements ValidatorInterface<CreateTestDriveSchema>
{
  private schema = z.object({
    driverId: z.string().min(1),
    motorcycleId: z.string().min(1),
    sessionDate: z.string().min(1),
    sessionDetails: z.string().min(1),
  });

  async validate(
    data: unknown
  ): Promise<ValidationResult<CreateTestDriveSchema>> {
    try {
      const validatedData = this.schema.parse(data) as CreateTestDriveSchema;
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
