export interface CreateDriverLicenseSchema {
  licenseNumber: string;
  issueDate: string;
  expirationDate: string;
  status: string;
  categories: string[];
  driverId: string;
}
