import { IncidentRepository } from "../../repositories/IncidentRepository";
import { IncidentEntity } from "../../../domain/entities/IncidentEntity";

export class ListIncidentsByMotorcycle {
  public constructor(private readonly incidentRepository: IncidentRepository) {}

  public async execute(motorcycleId: string): Promise<IncidentEntity[]> {
    return this.incidentRepository.findByMotorcycle(motorcycleId);
  }
}
