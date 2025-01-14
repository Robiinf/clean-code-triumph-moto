import { IncidentRepository } from "../../repositories/IncidentRepository";
import { IncidentEntity } from "../../../domain/entities/IncidentEntity";
import { DriverRepository } from "../../repositories/DriverRepository";
import { MotorcycleRepository } from "../../repositories/MotorcycleRepository";
import { VehicleNotFound } from "../../../domain/errors/VehicleNotFound";
import { DriverNotFound } from "../../../domain/errors/DriverNotFound";

export class CreateIncidentReport {
  public constructor(
    private readonly incidentRepository: IncidentRepository,
    private readonly driverRepository: DriverRepository,
    private readonly motorcycleRepository: MotorcycleRepository
  ) {}

  public async execute(
    driverId: string,
    motorcycleId: string,
    incidentDate: Date,
    incidentDetails: string
  ) {
    const driver = await this.driverRepository.findById(driverId);
    if (!driver) {
      return new DriverNotFound();
    }

    const motorcycle = await this.motorcycleRepository.findById(motorcycleId);
    if (!motorcycle) {
      return new VehicleNotFound();
    }

    const incident = IncidentEntity.create(
      driverId,
      motorcycleId,
      incidentDate,
      incidentDetails
    );

    await this.incidentRepository.save(incident);
  }
}
