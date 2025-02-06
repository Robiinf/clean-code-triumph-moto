import { IncidentRepository } from "../../repositories/IncidentRepository";

export class ListIncidentsByDriver {
  public constructor(private readonly incidentRepository: IncidentRepository) {}

  public async execute(driverId: string) {
    return this.incidentRepository.findByDriver(driverId);
  }
}
