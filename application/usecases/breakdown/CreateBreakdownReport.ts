import { BreakdownRepository } from "../../repositories/BreakdownRepository";
import { BreakdownEntity } from "../../../domain/entities/BreakdownEntity";
import { MotorcycleRepository } from "../../repositories/MotorcycleRepository";
import { VehicleNotFound } from "../../../domain/errors/VehicleNotFound";

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

    const breakdown = BreakdownEntity.create(
      breakdownDate,
      breakdownType,
      breakdownDescription,
      motorcycleId
    );

    if (breakdown instanceof Error) {
      return breakdown;
    }

    await this.breakdownRepository.save(breakdown);
  }
}
