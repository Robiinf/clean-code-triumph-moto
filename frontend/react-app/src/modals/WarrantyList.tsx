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
import { Warranty } from "@/types/Warranty";

interface Props {
  motorcycle: Motorcycle;
  setActionType: React.Dispatch<
    React.SetStateAction<
      | "view"
      | "add"
      | "edit"
      | "maintenance"
      | "breakdown"
      | "addBreakdown"
      | "warranty"
      | "addWarranty"
      | null
    >
  >;
}

const WarrantyList = (props: Props) => {
  const [warranties, setWarranties] = useState<Warranty[]>([]);

  useEffect(() => {
    // Fetch breakdowns from the API
    const fetchBreakdowns = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/motorcycles/${props.motorcycle.id}/warranties`
        );
        const data = await response.json();
        setWarranties(data.data);
      } catch (error) {
        console.error("Erreur lors du chargement des pannes :", error);
      }
    };

    fetchBreakdowns();
  }, [props.motorcycle.id]);

  return (
    <>
      <DialogHeader>
        <DialogTitle>Liste des garantie</DialogTitle>
        <DialogDescription>
          Concernant {props.motorcycle.model} de l'année {props.motorcycle.year}
        </DialogDescription>
      </DialogHeader>
      <div>
        <div className="grid grid-cols-4 gap-4 font-semibold">
          <p className="col-span-2">Type</p>

          <p className="text-right text-nowrap">Date de Début</p>
          <p className="text-right">Date de fin</p>
        </div>
        <hr className="border border-primary" />
        {warranties.map((warranty) => (
          <div className="grid grid-cols-4 gap-4" key={warranty.id}>
            <p className="col-span-2">{warranty.warrantyType}</p>

            <p className="text-right">
              {new Date(warranty.startDate).toLocaleDateString()}
            </p>
            <p className="text-right">
              {new Date(warranty.endDate).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
      <DialogFooter className="!justify-between w-full">
        <DialogClose asChild>
          <Button type="button" variant="secondary">
            Fermer
          </Button>
        </DialogClose>

        <Button
          type="button"
          onClick={() => props.setActionType("addWarranty")}
        >
          Ajouter une garantie
        </Button>
      </DialogFooter>
    </>
  );
};

export default WarrantyList;
