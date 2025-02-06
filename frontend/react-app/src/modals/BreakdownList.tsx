import {
  DialogFooter,
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

interface Props {
  motorcycle: {
    vin: string;
    model: string;
    year: number;
    status: string;
    mileage: number;
  };
}

const BreakdownList = ({ motorcycle }: Props) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Are you absolutely sure?</DialogTitle>
        <DialogDescription>Liste des pannes</DialogDescription>
      </DialogHeader>
      <h1>{motorcycle.vin}</h1>
      <ul>
        <li>Date: 19/01/2024 | Panne d'essence</li>
        <li>Date: 07/02/2024 | Panne moteur</li>
        <li>Date: 29/04/2024 | Carambolage</li>
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
