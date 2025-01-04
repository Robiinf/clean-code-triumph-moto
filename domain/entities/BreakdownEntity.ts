import { InvalidDateImpossible } from "../errors/InvalidDateImpossible";

export class BreakdownEntity {
  private constructor(
    public id: string,
    public breakdownDate: Date,
    public breakdownType: string,
    public breakdownDescription: string,
    public motorcycleId: string
  ) {}

  public static create(
    breakdownDate: Date,
    breakdownType: string,
    breakdownDescription: string,
    motorcycleId: string
  ) {
    const id = crypto.randomUUID();

    if (breakdownDate > new Date()) {
      return new InvalidDateImpossible();
    }

    return new BreakdownEntity(
      id,
      breakdownDate,
      breakdownType,
      breakdownDescription,
      motorcycleId
    );
  }
}
