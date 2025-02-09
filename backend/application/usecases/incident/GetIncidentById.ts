import { IncidentRepository } from "../../repositories/IncidentRepository";
import { IncidentNotFoundError } from "../../../domain/errors/IncidentNotFoundError";

export class GetIncidentById {
  constructor(private readonly incidentRepository: IncidentRepository) {}

  async execute(id: string) {
    const incident = await this.incidentRepository.findById(id);
    if (!incident) {
      return new IncidentNotFoundError();
    }

    return incident;
  }
}
