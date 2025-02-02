import { Connection } from "mongoose";
import { IncidentRepository } from "../../../application/repositories/IncidentRepository";
import { IncidentEntity } from "../../../domain/entities/IncidentEntity";
import { CompanySchema } from "../schemas/CompanySchema";

export class MongoIncidentRepository implements IncidentRepository {
  private companyModel;

  constructor(connection: Connection) {
    this.companyModel = connection.model("CompanyEntity", CompanySchema);
  }

  async save(incident: IncidentEntity): Promise<void> {
    const existingIncident = await this.findById(incident.id);

    if (existingIncident) {
      // Pour la mise à jour, on utilise la méthode arrayFilters
      await this.companyModel.updateOne(
        { "drivers.incidents.id": incident.id },
        {
          $set: {
            "drivers.$[driver].incidents.$[incident]": {
              id: incident.id,
              motorcycleId: incident.motorcycleId,
              incidentDate: incident.incidentDate,
              incidentDetails: incident.incidentDetails,
            },
          },
        },
        {
          arrayFilters: [
            { "driver.incidents.id": incident.id },
            { "incident.id": incident.id },
          ],
        }
      );
    } else {
      // Pour un nouvel incident
      await this.companyModel.updateOne(
        { "drivers.id": incident.driverId },
        {
          $push: {
            "drivers.$.incidents": {
              id: incident.id,
              motorcycleId: incident.motorcycleId,
              incidentDate: incident.incidentDate,
              incidentDetails: incident.incidentDetails,
            },
          },
        }
      );
    }
  }

  async findById(id: string): Promise<IncidentEntity | null> {
    const company = await this.companyModel.findOne(
      { "drivers.incidents.id": id },
      { "drivers.$": 1 }
    );

    if (!company || !company.drivers || !company.drivers[0]) {
      return null;
    }

    const driver = company.drivers[0];
    const incident = driver.incidents.find((inc) => inc.id === id);

    if (!incident) {
      return null;
    }

    return IncidentEntity.restore(
      incident.id,
      driver.id,
      incident.motorcycleId,
      incident.incidentDate,
      incident.incidentDetails
    );
  }

  async findByDriver(driverId: string): Promise<IncidentEntity[]> {
    const company = await this.companyModel.findOne(
      { "drivers.id": driverId },
      { "drivers.$": 1 }
    );

    if (!company || !company.drivers || !company.drivers[0]) {
      return [];
    }

    const driver = company.drivers[0];
    return driver.incidents.map((incident) =>
      IncidentEntity.restore(
        incident.id,
        driver.id,
        incident.motorcycleId,
        incident.incidentDate,
        incident.incidentDetails
      )
    );
  }

  async findByMotorcycle(motorcycleId: string): Promise<IncidentEntity[]> {
    const companies = await this.companyModel.find(
      { "drivers.incidents.motorcycleId": motorcycleId },
      { "drivers.incidents.$": 1, "drivers.id": 1 }
    );

    const incidents: IncidentEntity[] = [];

    companies.forEach((company) => {
      company.drivers.forEach((driver) => {
        const driverIncidents = driver.incidents
          .filter((inc) => inc.motorcycleId === motorcycleId)
          .map((incident) =>
            IncidentEntity.restore(
              incident.id,
              driver.id,
              incident.motorcycleId,
              incident.incidentDate,
              incident.incidentDetails
            )
          );
        incidents.push(...driverIncidents);
      });
    });

    return incidents;
  }
}
