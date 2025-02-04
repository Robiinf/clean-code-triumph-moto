export interface CreateDriverLicenseSchema {
  licenseNumber: string;
  issueDate: string; // on recevra une string qu'on convertira en Date
  expirationDate: string; // on recevra une string qu'on convertira en Date
  status: string;
  categories: string[]; // LicenseCategory[]
  driverId: string; // nécessaire pour save()
}
