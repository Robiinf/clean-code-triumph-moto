import { RentalRepository } from "../../repositories/RentalRepository";
import { MotorcycleRepository } from "../../repositories/MotorcycleRepository";
import { DriverRepository } from "../../repositories/DriverRepository";
import { VehicleNotFound } from "../../../domain/errors/VehicleNotFound";
import { DriverNotFound } from "../../../domain/errors/DriverNotFound";
import { RentalEntity } from "../../../domain/entities/RentalEntity";

export class CreateRentalReport {
  constructor(
    private rentalRepository: RentalRepository,
    private motorcycleRepository: MotorcycleRepository,
    private driverRepository: DriverRepository
  ) {}

  public async execute(
    motorcycleId: string,
    driverId: string,
    rentalStartDate: Date,
    rentalEndDate: Date,
    dailyRate: number,
    returnDate: Date | null
  ) {
    const motorcycle = await this.motorcycleRepository.findById(motorcycleId);
    if (!motorcycle) {
      return new VehicleNotFound();
    }

    const driver = await this.driverRepository.findById(driverId);
    if (!driver) {
      return new DriverNotFound();
    }

    const rental = RentalEntity.create(
      motorcycleId,
      driverId,
      rentalStartDate,
      rentalEndDate,
      dailyRate,
      returnDate
    );

    if (rental instanceof Error) {
      return rental;
    }

    await this.rentalRepository.save(rental);
  }
}
