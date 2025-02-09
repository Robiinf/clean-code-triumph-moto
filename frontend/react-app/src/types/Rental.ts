export interface Rental {
  id: string;
  motorcycleId: string;
  renterId: string;
  rentalStartDate: string;
  rentalEndDate: string;
  dailyRate: number;
  rentalStatus: string;
  returnDate: string | null;
}
