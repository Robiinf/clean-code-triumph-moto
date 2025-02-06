import { BreakdownRepository } from "../../repositories/BreakdownRepository";
import { BreakdownEntity } from "../../../domain/entities/BreakdownEntity";
import { MotorcycleRepository } from "../../repositories/MotorcycleRepository";
import { VehicleNotFound } from "../../../domain/errors/VehicleNotFound";
import { BreakdownFutureDateNotAllowed } from "../../../domain/errors/BreakdownFutureDateNotAllowed";
import { BreakdownType } from "../../../domain/types/BreakdownType";

export class CreateBreakdownReport {
  constructor(
    private readonly breakdownRepository: BreakdownRepository,
    private readonly motorcycleRepository: MotorcycleRepository
  ) {}

  async execute(
    breakdownDate: Date,
    breakdownType: string,
    breakdownDescription: string,
    motorcycleId: string
  ) {
    const motorcycle = await this.motorcycleRepository.findById(motorcycleId);
    if (!motorcycle) {
      return new VehicleNotFound();
    }

    if (breakdownDate > new Date()) {
      return new BreakdownFutureDateNotAllowed();
    }

    const breakdownTypeValue = BreakdownType.from(breakdownType);
    if (breakdownTypeValue instanceof Error) {
      return breakdownTypeValue;
    }

    const breakdown = BreakdownEntity.create(
      breakdownDate,
      breakdownTypeValue,
      breakdownDescription,
      motorcycleId
    );

    await this.breakdownRepository.save(breakdown);
  }
}
