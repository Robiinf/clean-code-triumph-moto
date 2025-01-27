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
