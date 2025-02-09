export interface CreateDriverSchema {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  birthDate: string;
  companyId: string;
  driverLicenseId?: string;
}
