import { InvalidRentalDate } from "../errors/InvalidRentalDate";
import { NegativeDailyRateError } from "../errors/NegativeDailyRateError";
import { InvalidRentalReturnDate } from "../errors/InvalidRentalReturnDate";

const calculateRentalStatus = (
  rentalEndDate: Date,
  returnDate: Date | null
) => {
  if (returnDate) {
    return "Returned";
  }

  if (new Date() > rentalEndDate) {
    return "Overdue";
  }

  return "Active";
};

export class RentalEntity {
  private constructor(
    public id: string,
    public motorcycleId: string,
    public renterId: string,
    public rentalStartDate: Date,
    public rentalEndDate: Date,
    public dailyRate: number,
    public rentalStatus: string,
    public returnDate: Date | null
  ) {}

  public static create(
    motorcycleId: string,
    renterId: string,
    rentalStartDate: Date,
    rentalEndDate: Date,
    dailyRate: number,
    returnDate: Date | null
  ) {
    const id = crypto.randomUUID();

    if (rentalStartDate > rentalEndDate) {
      return new InvalidRentalDate();
    }

    if (dailyRate <= 0) {
      return new NegativeDailyRateError();
    }

    if (returnDate && returnDate < rentalStartDate) {
      return new InvalidRentalReturnDate();
    }

    const rentalStatus = calculateRentalStatus(rentalEndDate, returnDate);

    return new RentalEntity(
      id,
      motorcycleId,
      renterId,
      rentalStartDate,
      rentalEndDate,
      dailyRate,
      rentalStatus,
      returnDate ? returnDate : null
    );
  }
}
