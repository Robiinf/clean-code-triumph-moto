import { RentalRepository } from "../../repositories/RentalRepository";
import { MotorcycleRepository } from "../../repositories/MotorcycleRepository";
import { DriverRepository } from "../../repositories/DriverRepository";
import { VehicleNotFound } from "../../../domain/errors/VehicleNotFound";
import { DriverNotFound } from "../../../domain/errors/DriverNotFound";
import { RentalEntity } from "../../../domain/entities/RentalEntity";
import { InvalidRentalDate } from "../../../domain/errors/InvalidRentalDate";
import { NegativeDailyRateError } from "../../../domain/errors/NegativeDailyRateError";
import { InvalidRentalReturnDate } from "../../../domain/errors/InvalidRentalReturnDate";

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

    if (rentalStartDate > rentalEndDate) {
      return new InvalidRentalDate();
    }

    if (dailyRate <= 0) {
      return new NegativeDailyRateError();
    }

    if (returnDate && returnDate < rentalStartDate) {
      return new InvalidRentalReturnDate();
    }

    const rental = RentalEntity.create(
      motorcycleId,
      driverId,
      rentalStartDate,
      rentalEndDate,
      dailyRate,
      returnDate
    );

    await this.rentalRepository.save(rental);
  }
}
