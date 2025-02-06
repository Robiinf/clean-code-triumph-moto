import crypto from "crypto";
import { InvalidDateImpossible } from "../errors/InvalidDateImpossible";

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
  constructor(
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
  ): RentalEntity {
    const id = crypto.randomUUID();

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

  public update(returnDate: Date): RentalEntity | InvalidDateImpossible {
    if (returnDate < this.rentalStartDate) {
      return new InvalidDateImpossible();
    }

    const rentalStatus = calculateRentalStatus(this.rentalEndDate, returnDate);

    return new RentalEntity(
      this.id,
      this.motorcycleId,
      this.renterId,
      this.rentalStartDate,
      this.rentalEndDate,
      this.dailyRate,
      rentalStatus,
      returnDate
    );
  }
}
