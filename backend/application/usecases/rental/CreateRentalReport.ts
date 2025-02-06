import { RentalRepository } from "../../repositories/RentalRepository";
import { MotorcycleRepository } from "../../repositories/MotorcycleRepository";
import { DriverRepository } from "../../repositories/DriverRepository";
import { VehicleNotFound } from "../../../domain/errors/VehicleNotFound";
import { DriverNotFound } from "../../../domain/errors/DriverNotFound";
import { RentalEntity } from "../../../domain/entities/RentalEntity";
import { InvalidRentalDate } from "../../../domain/errors/InvalidRentalDate";
import { NegativeDailyRateError } from "../../../domain/errors/NegativeDailyRateError";
import { InvalidRentalReturnDate } from "../../../domain/errors/InvalidRentalReturnDate";
import { DriverLicenseNotFoundError } from "../../../domain/errors/DriverLicenseNotFoundError";
import { OverlappingRentalError } from "../../../domain/errors/OverlappingRentalError";

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

    if (!driver.driverLicenseId) {
      return new DriverLicenseNotFoundError();
    }

    if (rentalStartDate > rentalEndDate) {
      return new InvalidRentalDate();
    }

    const overlappingRentals =
      await this.rentalRepository.findOverlappingRentals(
        motorcycleId,
        rentalStartDate,
        rentalEndDate
      );

    if (overlappingRentals.length > 0) {
      return new OverlappingRentalError();
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
