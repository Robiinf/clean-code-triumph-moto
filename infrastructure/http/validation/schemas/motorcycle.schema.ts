export interface CreateMotorcycleSchema {
  vin: string;
  model: string;
  year: number;
  status: string;
  mileageInKilometers: number;
  motorcycleType: string;
  power: number;
  fuelType: string;
  transmission: string;
  fuelTankCapacityInLiters: number;
}
