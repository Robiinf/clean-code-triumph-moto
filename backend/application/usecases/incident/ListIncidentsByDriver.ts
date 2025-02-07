import { IncidentRepository } from "../../repositories/IncidentRepository";
import { IncidentEntity } from "../../../domain/entities/IncidentEntity";

export class ListIncidentsByDriver {
  public constructor(private readonly incidentRepository: IncidentRepository) {}

  public async execute(driverId: string): Promise<IncidentEntity[]> {
    return this.incidentRepository.findByDriver(driverId);
  }
}
