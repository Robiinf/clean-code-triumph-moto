export interface License {
  id: string;
  licenseNumber: string;
  issueDate: string;
  expirationDate: string;
  status: string;
  categories: {
    value: string;
  }[];
}
