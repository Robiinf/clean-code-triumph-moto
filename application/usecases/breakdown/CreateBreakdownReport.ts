import { BreakdownRepository } from "../../repositories/BreakdownRepository";
import { BreakdownEntity } from "../../../domain/entities/BreakdownEntity";

export class CreateBreakdownReport {
  constructor(private readonly breakdownRepository: BreakdownRepository) {}

  async execute(
    breakdownDate: Date,
    breakdownType: string,
    breakdownDescription: string,
    motorcycleId: string
  ) {
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
