import { IncidentRepository } from "../../repositories/IncidentRepository";
import { IncidentEntity } from "../../../domain/entities/IncidentEntity";

export class CreateIncidentReport {
  public constructor(private readonly incidentRepository: IncidentRepository) {}

  public async execute(
    driverId: string,
    incidentDate: Date,
    incidentDetails: string
  ) {
    const incident = IncidentEntity.create(
      driverId,
      incidentDate,
      incidentDetails
    );

    await this.incidentRepository.save(incident);
  }
}
