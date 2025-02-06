import {
  DialogFooter,
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Maintenance } from "@/types/Maintenance";
import { useEffect, useState } from "react";
import type { Motorcycle } from "@/types/Motorcycle";

interface Props {
  maintenance: Maintenance;
}

const MotorcycleOnMaintenace = (props: Props) => {
  const [motorcycle, setMotorcycle] = useState<Motorcycle | null>(null);

  useEffect(() => {
    const fetchMotorcycle = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/motorcycles/" + props.maintenance.motorcycleId
        );
        const data = await response.json();
        console.log(data);
        setMotorcycle(data);
      } catch (error) {
        console.error("Erreur lors du chargement des entreprises :", error);
      }
    };

    fetchMotorcycle();
  }, [props.maintenance.motorcycleId]);

  return (
    <>
      <DialogHeader>
        <DialogTitle>Detail de la Moto</DialogTitle>
        <DialogDescription>
          Concernant la maintenance du :{" "}
          {new Date(props.maintenance.maintenanceDate).toLocaleDateString()}
        </DialogDescription>
      </DialogHeader>
      {motorcycle && (
        <div className="grid grid-cols-5 gap-4">
          <p className="col-span-2">VIN:</p>
          <p className="col-span-3 tracking-widest">{motorcycle.vin.value}</p>

          <p className="col-span-2">Model:</p>
          <p className="col-span-3">{motorcycle.model}</p>

          <p className="col-span-2">Année:</p>
          <p className="col-span-3">{motorcycle.year}</p>

          <p className="col-span-2">Statut:</p>
          <p
            className={
              motorcycle.status === "available"
                ? "text-green-500 col-span-3"
                : "text-rose-400 col-span-3"
            }
          >
            {motorcycle.status === "available" ? "Disponible" : "Indisponible"}
          </p>

          <p className="col-span-2">Kilometrage:</p>
          <p className="col-span-3">{motorcycle.mileageInKilometers.value}km</p>

          <p className="col-span-2">Type:</p>
          <p className="col-span-3">{motorcycle.motorcycleType.value}</p>

          <p className="col-span-2">Puissance:</p>
          <p className="col-span-3">{motorcycle.power}ch</p>

          <p className="col-span-2">Carburant:</p>
          <p className="col-span-3">{motorcycle.fuelType.value}</p>

          <p className="col-span-2">Capacité du réservoir:</p>
          <p className="col-span-3">
            {motorcycle.fuelTankCapacityInLiters.value}L
          </p>

          <p className="col-span-2">Transmission:</p>
          <p className="col-span-3">{motorcycle.transmission}</p>
        </div>
      )}
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

export default MotorcycleOnMaintenace;
