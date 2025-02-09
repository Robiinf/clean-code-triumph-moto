import {
  DialogFooter,
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Motorcycle } from "@/types/Motorcycle";
import { useEffect, useState } from "react";
import type { Maintenance } from "@/types/Maintenance";

interface Props {
  motorcycle: Motorcycle;
}

const MaintenanceOnMotorcycle = ({ motorcycle }: Props) => {
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);

  useEffect(() => {
    // Fetch breakdowns from the API
    const fetchMaintenances = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/motorcycles/${motorcycle.id}/maintenances`
        );
        const data = await response.json();
        setMaintenances(data.data);
      } catch (error) {
        console.error("Erreur lors du chargement des pannes :", error);
      }
    };

    fetchMaintenances();
  }, [motorcycle.id]);

  return (
    <>
      <DialogHeader>
        <DialogTitle>Liste des Maintenances</DialogTitle>
        <DialogDescription>
          Concernant {motorcycle.model} de l'année {motorcycle.year}
        </DialogDescription>
      </DialogHeader>
      <h1>
        VIN: <span className="tracking-widest">{motorcycle.vin.value}</span>
      </h1>
      <ul>
        {maintenances
          .sort((a: Maintenance, b: Maintenance) => {
            return (
              new Date(b.maintenanceDate).getTime() -
              new Date(a.maintenanceDate).getTime()
            );
          })
          .map((maintenance) => (
            <li key={maintenance.id}>
              {new Date(maintenance.maintenanceDate).toLocaleDateString()} -
              {maintenance.description}
            </li>
          ))}
      </ul>
      <DialogFooter className="sm:justify-start">
        <DialogClose asChild>
          <Button type="button" variant="secondary">
            Fermer
          </Button>
        </DialogClose>
      </DialogFooter>
    </>
  );
};

export default MaintenanceOnMotorcycle;
