export interface CreateIncidentSchema {
  driverId: string;
  motorcycleId: string;
  incidentDate: string; // on recevra une string qu'on convertira en Date
  incidentDetails: string;
}
