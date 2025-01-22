import { IncidentRepository } from "../../repositories/IncidentRepository";

export class ListIncidentsByMotorcycle {
  public constructor(private readonly incidentRepository: IncidentRepository) {}

  public async execute(motorcycleId: string) {
    return this.incidentRepository.findByMotorcycle(motorcycleId);
  }
}
