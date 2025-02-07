import { IncidentRepository } from "../../repositories/IncidentRepository";
import { IncidentNotFoundError } from "../../../domain/errors/IncidentNotFoundError";
import { IncidentEntity } from "../../../domain/entities/IncidentEntity";

export class GetIncidentById {
  constructor(private readonly incidentRepository: IncidentRepository) {}

  async execute(id: string): Promise<IncidentNotFoundError | IncidentEntity> {
    const incident = await this.incidentRepository.findById(id);
    if (!incident) {
      return new IncidentNotFoundError();
    }

    return incident;
  }
}
