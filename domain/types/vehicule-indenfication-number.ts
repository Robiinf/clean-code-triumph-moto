export type VIN = string & { _brand: "VIN" };

export const createVIN = (vin: string): VIN => {
  if (vin.length !== 17) {
    throw new Error("VIN must be 17 characters long");
  }
  return vin as VIN;
};

export const verifyVIN = (vin: string): boolean => {
  return vin.length === 17;
};
