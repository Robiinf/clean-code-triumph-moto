import {
  DialogFooter,
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Incident } from "@/types/Incident";
import { useEffect, useState } from "react";
import type { Driver } from "@/types/Driver";

interface Props {
  driver: Driver;
}

const IncidentsOnDriver = ({ driver }: Props) => {
  const [incidents, setIncidents] = useState<Incident[]>([]);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/drivers/${driver.id}/incidents`
        );
        const data = await response.json();
        setIncidents(data.data);
      } catch (error) {
        console.error("Erreur lors du chargement des incidents :", error);
      }
    };

    fetchIncidents();
  }, [driver.id]);

  return (
    <>
      <DialogHeader>
        <DialogTitle>Liste des incidents</DialogTitle>
        <DialogDescription>
          Concernant {driver.firstName} {driver.lastName}
        </DialogDescription>
      </DialogHeader>
      <ul>
        {incidents
          .sort((a: Incident, b: Incident) => {
            return (
              new Date(b.incidentDate).getTime() -
              new Date(a.incidentDate).getTime()
            );
          })
          .map((incident) => (
            <li key={incident.id}>
              {new Date(incident.incidentDate).toLocaleDateString()} -{" "}
              {incident.incidentDetails}
            </li>
          ))}
      </ul>
      <DialogFooter>
        <DialogClose>
          <Button>Close</Button>
        </DialogClose>
      </DialogFooter>
    </>
  );
};

export default IncidentsOnDriver;
