import { InvalidDateImpossible } from "../errors/InvalidDateImpossible";

export class WarrantyEntity {
  private constructor(
    public id: string,
    public startDate: Date,
    public endDate: Date,
    public warrantyType: string,
    public warrantyStatus: string,
    public motorcyleId: string
  ) {}

  public static create(
    startDate: Date,
    endDate: Date,
    warrantyType: string,
    motorcyleId: string
  ) {
    const id = crypto.randomUUID();

    if (startDate > endDate) {
      return new InvalidDateImpossible();
    }

    const warrantyStatus = "active";

    return new WarrantyEntity(
      id,
      startDate,
      endDate,
      warrantyType,
      warrantyStatus,
      motorcyleId
    );
  }
}
