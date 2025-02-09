import crypto from "crypto";
import { BreakdownType } from "../types/BreakdownType";
export class BreakdownEntity {
  constructor(
    public id: string,
    public breakdownDate: Date,
    public breakdownType: BreakdownType,
    public breakdownDescription: string,
    public motorcycleId: string
  ) {}

  public static create(
    breakdownDate: Date,
    breakdownType: BreakdownType,
    breakdownDescription: string,
    motorcycleId: string
  ): BreakdownEntity {
    const id = crypto.randomUUID();
    return new BreakdownEntity(
      id,
      breakdownDate,
      breakdownType,
      breakdownDescription,
      motorcycleId
    );
  }
}
