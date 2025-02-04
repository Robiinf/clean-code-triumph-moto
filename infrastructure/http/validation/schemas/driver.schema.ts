// src/infrastructure/http/validation/schemas/driver.schema.ts
export interface CreateDriverSchema {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  birthDate: string; // on recevra une string qu'on convertira en Date
  companyId: string;
  driverLicenseId?: string;
}
