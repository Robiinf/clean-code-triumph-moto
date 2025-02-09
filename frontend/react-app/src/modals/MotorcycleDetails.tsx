import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";

import { Motorcycle } from "@/types/Motorcycle";

interface Props {
  motorcycle: Motorcycle;
}

const MotorcycleDetails = (props: Props) => {
  const [maintenanceRecursions, setMaintenanceRecursions] = useState([]);

  const fetchMaintenanceRecursions = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/motorcycles/${props.motorcycle.id}/maintenance-recursions`
      );
      const data = await response.json();
      setMaintenanceRecursions(data.data);
    } catch (error) {
      console.error(
        "Erreur lors du chargement des récurrences de maintenance :",
        error
      );
    }
  };

  useEffect(() => {
    fetchMaintenanceRecursions();
  }, [props.motorcycle.id]);

  return (
    <>
      <DialogHeader>
        <DialogTitle>Detail de la Moto</DialogTitle>
        <DialogDescription>
          Concernant {props.motorcycle.model} de l'année {props.motorcycle.year}
        </DialogDescription>
      </DialogHeader>
      <div className="grid grid-cols-5 gap-4">
        <p className="col-span-2">VIN: </p>
        <p className="col-span-3">{props.motorcycle.vin.value}</p>

        <p className="col-span-2">Type:</p>
        <p className="col-span-3">{props.motorcycle.motorcycleType.value}</p>

        <p className="col-span-2">Statut:</p>
        <p className="col-span-3">{props.motorcycle.status}</p>

        <p className="col-span-2">Kilometrage:</p>
        <p className="col-span-3">
          {props.motorcycle.mileageInKilometers.value}km
        </p>

        <p className="col-span-2">Puissance:</p>
        <p className="col-span-3">{props.motorcycle.power}ch</p>

        <p className="col-span-2">Type de Carburant:</p>
        <p className="col-span-3">{props.motorcycle.fuelType.value}</p>

        <p className="col-span-2">Capacité du réservoir:</p>
        <p className="col-span-3">
          {props.motorcycle.fuelTankCapacityInLiters.value}L
        </p>

        <p className="col-span-2">Transmission:</p>
        <p className="col-span-3">{props.motorcycle.transmission}</p>
      </div>
      <div className="border-t border-gray-300 my-4"></div>

      <h2 className="text-lg font-bold">Maintenances récurrentes</h2>
      <ul>
        {maintenanceRecursions.map((recursion) => (
          <li key={recursion.id}>
            {recursion.description} - {recursion.intervalKm} km /{" "}
            {recursion.intervalMonths} mois
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

export default MotorcycleDetails;
