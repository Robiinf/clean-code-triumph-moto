import {
  Controller,
  Post,
  Get,
  Delete,
  Put,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { AddMotorcycle } from "../../../../application/usecases/motorcycle/AddMotorcycle";
import { ListAllMotorcycles } from "../../../../application/usecases/motorcycle/ListAllMotorcycles";
import { GetMotorcycleById } from "../../../../application/usecases/motorcycle/GetMotorcycleById";
import { RemoveMotorcycle } from "../../../../application/usecases/motorcycle/RemoveMotorcycle";
import { EditMotorcycle } from "../../../../application/usecases/motorcycle/EditMotorcycle";
import { ZodMotorcycleValidator } from "../../validation/implementations/zod/ZodMotorcycleValidator";

@Controller("motorcycles")
export class MotorcycleController {
  private validator: ZodMotorcycleValidator;

  constructor(
    private addMotorcycle: AddMotorcycle,
    private listAllMotorcycles: ListAllMotorcycles,
    private getMotorcycleById: GetMotorcycleById,
    private removeMotorcycle: RemoveMotorcycle,
    private editMotorcycle: EditMotorcycle
  ) {
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
          error: motorcycle.name,
        },
        HttpStatus.BAD_REQUEST
      );
    }

    return { status: HttpStatus.CREATED };
  }

  @Get()
  async findAll() {
    try {
      const motorcycles = await this.listAllMotorcycles.execute();
      return motorcycles;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: "Failed to retrieve motorcycles",
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(":id")
  async findById(@Param("id") id: string) {
    const result = await this.getMotorcycleById.execute(id);

    if (result instanceof Error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: result.name,
        },
        HttpStatus.NOT_FOUND
      );
    }

    return result;
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    const result = await this.removeMotorcycle.execute(id);

    if (result instanceof Error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: result.name,
        },
        HttpStatus.NOT_FOUND
      );
    }

    return { status: HttpStatus.NO_CONTENT };
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() data: unknown) {
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

    const result = await this.editMotorcycle.execute(
      id,
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

    if (result instanceof Error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: result.name,
        },
        HttpStatus.BAD_REQUEST
      );
    }

    return { status: HttpStatus.OK };
  }
}
