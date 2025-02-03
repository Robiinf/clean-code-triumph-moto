// src/infrastructure/http/validation/schemas/company.schema.ts
export interface CreateCompanySchema {
  name: string;
  siret: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}
