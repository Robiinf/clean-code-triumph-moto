import type { CompanyName } from "../types/CompanyName";
import type { CompanySiret } from "../types/CompanySiret";
import crypto from "crypto";

export class CompanyEntity {
  private constructor(
    public id: string,
    public name: CompanyName,
    public siret: CompanySiret,
    public phone: string,
    public address: string,
    public city: string,
    public postalCode: string,
    public country: string,
    public createdAt: Date,
    public updatedAt: Date
  ) {}

  public static create(
    name: CompanyName,
    siret: CompanySiret,
    phone: string,
    address: string,
    city: string,
    postalCode: string,
    country: string
  ): CompanyEntity {
    const id = crypto.randomUUID();
    const createdAt = new Date();
    const updatedAt = new Date();
    return new CompanyEntity(
      id,
      name,
      siret,
      phone,
      address,
      city,
      postalCode,
      country,
      createdAt,
      updatedAt
    );
  }

  public static restore(
    id: string,
    name: CompanyName,
    siret: CompanySiret,
    phone: string,
    address: string,
    city: string,
    postalCode: string,
    country: string,
    createdAt: Date,
    updatedAt: Date
  ): CompanyEntity {
    return new CompanyEntity(
      id,
      name,
      siret,
      phone,
      address,
      city,
      postalCode,
      country,
      createdAt,
      updatedAt
    );
  }
}
