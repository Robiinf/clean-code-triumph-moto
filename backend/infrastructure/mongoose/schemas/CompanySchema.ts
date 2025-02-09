import mongoose, { Schema } from "mongoose";
import { CompanyName } from "../../../domain/types/CompanyName";
import { CompanySiret } from "../../../domain/types/CompanySiret";

const IncidentSchema = new Schema({
  id: { type: String, required: true },
  motorcycleId: { type: String, required: true },
  incidentDate: { type: Date, required: true },
  incidentDetails: { type: String, required: true },
});

const DriverLicenseSchema = new Schema({
  id: { type: String, required: true },
  licenseNumber: { type: String, required: true },
  issueDate: { type: Date, required: true },
  expirationDate: { type: Date, required: true },
  status: { type: String, required: true },
  categories: [{ type: String, required: true }],
});

const DriverSchema = new Schema({
  id: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  birthDate: { type: Date, required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
  driverLicense: { type: DriverLicenseSchema, required: false },
  incidents: [IncidentSchema],
});

export const CompanySchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    siret: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
    drivers: [DriverSchema],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

CompanySchema.index({ id: 1 }, { unique: true });
CompanySchema.index({ siret: 1 }, { unique: true });
CompanySchema.index({ "drivers.id": 1 });

export interface CompanyDocument extends mongoose.Document {
  id: string;
  name: CompanyName;
  siret: CompanySiret;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;
  drivers: Array<{
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    birthDate: Date;
    createdAt: Date;
    updatedAt: Date;
    driverLicense: {
      id: string;
      licenseNumber: string;
      issueDate: Date;
      expirationDate: Date;
      status: string;
      categories: string[];
    };
    incidents: Array<{
      id: string;
      motorcycleId: string;
      incidentDate: Date;
      incidentDetails: string;
    }>;
  }>;
}

export const CompanyModel = mongoose.model<CompanyDocument>(
  "CompanyEntity",
  CompanySchema
);
