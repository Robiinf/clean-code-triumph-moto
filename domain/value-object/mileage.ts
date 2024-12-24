export type Mileage = number & { _brand: "mileage" };

export const createMileage = (mileage: number): Mileage => {
  if (mileage < 0) {
    throw new Error("Mileage must be a positive number");
  }
  return mileage as Mileage;
};

export const verifyMileage = (mileage: number): boolean => {
  return mileage >= 0;
};
