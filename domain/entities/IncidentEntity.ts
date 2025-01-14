export class IncidentEntity {
  private constructor(
    public id: string,
    public driverId: string,
    public motorcycleId: string,
    public incidentDate: Date,
    public incidentDetails: string
  ) {}

  public static create(
    driverId: string,
    motorcycleId: string,
    incidentDate: Date,
    incidentDetails: string
  ): IncidentEntity {
    const id = crypto.randomUUID();
    return new IncidentEntity(
      id,
      driverId,
      motorcycleId,
      incidentDate,
      incidentDetails
    );
  }
}
