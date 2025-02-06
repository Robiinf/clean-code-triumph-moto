export interface CreateRentalSchema {
  motorcycleId: string;
  renterId: string;
  rentalStartDate: string;
  rentalEndDate: string;
  dailyRate: number;
  returnDate?: string | null;
}
