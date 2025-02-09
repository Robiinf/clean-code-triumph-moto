export interface Motorcycle {
  id: string;
  vin: { value: string };
  model: string;
  year: number;
  status: string;
  mileageInKilometers: { value: number };
  motorcycleType: { value: string };
  power: number;
  fuelType: { value: string };
  transmission: string;
  fuelTankCapacityInLiters: { value: number };
}
