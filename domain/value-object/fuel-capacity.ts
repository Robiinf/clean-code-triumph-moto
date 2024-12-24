export type fuelCapacity = number & { _brand: "fuelCapacity" };

export const createFuelCapacity = (fuelCapacity: number): fuelCapacity => {
  if (fuelCapacity < 0) {
    throw new Error("Fuel capacity must be a positive number");
  }
  return fuelCapacity as fuelCapacity;
};

export const verifyFuelCapacity = (fuelCapacity: number): boolean => {
  return fuelCapacity >= 0;
};
