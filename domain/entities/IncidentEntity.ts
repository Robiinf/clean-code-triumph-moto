export class IncidentEntity {
  private constructor(
    public id: string,
    public driverId: string,
    public incidentDate: Date,
    public incidentDetails: string
  ) {}

  public static create(
    driverId: string,
    incidentDate: Date,
    incidentDetails: string
  ): IncidentEntity {
    const id = crypto.randomUUID();
    return new IncidentEntity(id, driverId, incidentDate, incidentDetails);
  }
}
