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
import { Breakdown } from "@/types/Breakdown";

interface Props {
  motorcycle: Motorcycle;
}

const BreakdownList = ({ motorcycle }: Props) => {
  const [breakdowns, setBreakdowns] = useState<Breakdown[]>([]);

  useEffect(() => {
    // Fetch breakdowns from the API
    const fetchBreakdowns = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/motorcycles/${motorcycle.id}/breakdowns`
        );
        const data = await response.json();
        setBreakdowns(data.data);
      } catch (error) {
        console.error("Erreur lors du chargement des pannes :", error);
      }
    };

    fetchBreakdowns();
  }, [motorcycle.id]);

  return (
    <>
      <DialogHeader>
        <DialogTitle>Liste des pannes</DialogTitle>
        <DialogDescription>
          Concernant {motorcycle.model} de l'année {motorcycle.year}
        </DialogDescription>
      </DialogHeader>
      <h1>
        VIN: <span className="tracking-widest">{motorcycle.vin.value}</span>
      </h1>
      <ul>
        {breakdowns.map((breakdown) => (
          <li key={breakdown.id}>
            {breakdown.breakdownDescription} -{" "}
            {new Date(breakdown.breakdownDate).toLocaleDateString()}
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

export default BreakdownList;
