import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { AddMotorcycle } from "../../../../application/usecases/motorcycle/AddMotorcycle";
import { ZodMotorcycleValidator } from "../../validation/implementations/zod/ZodMotorcycleValidator";

@Controller("motorcycles")
export class MotorcycleController {
  private validator: ZodMotorcycleValidator;

  constructor(private addMotorcycle: AddMotorcycle) {
    this.validator = new ZodMotorcycleValidator();
  }

  @Post()
  async create(@Body() data: unknown) {
    const validationResult = await this.validator.validate(data);

    if (!validationResult.success) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          errors: validationResult.errors,
        },
        HttpStatus.BAD_REQUEST
      );
    }

    const motorcycle = await this.addMotorcycle.execute(
      validationResult.data.vin,
      validationResult.data.model,
      validationResult.data.year,
      validationResult.data.status,
      validationResult.data.mileageInKilometers,
      validationResult.data.motorcycleType,
      validationResult.data.power,
      validationResult.data.fuelType,
      validationResult.data.transmission,
      validationResult.data.fuelTankCapacityInLiters
    );

    if (motorcycle instanceof Error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: motorcycle.message,
        },
        HttpStatus.BAD_REQUEST
      );
    }

    return { status: HttpStatus.CREATED };
  }
}
