import { IncidentRepository } from "../../repositories/IncidentRepository";
import { IncidentNotFoundError } from "../../../domain/errors/IncidentNotFoundError";

export class EditIncident {
  constructor(private readonly incidentRepository: IncidentRepository) {}

  async execute(
    id: string,
    driverId: string,
    motorcycleId: string,
    incidentDate: Date,
    incidentDetails: string
  ): Promise<void | IncidentNotFoundError> {
    const incident = await this.incidentRepository.findById(id);
    if (!incident) {
      return new IncidentNotFoundError();
    }

    const updatedIncident = incident.update(
      driverId,
      motorcycleId,
      incidentDate,
      incidentDetails
    );

    await this.incidentRepository.save(updatedIncident);
  }
}
