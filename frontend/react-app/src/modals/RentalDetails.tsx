import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { Rental } from "@/types/Rental";

interface Props {
  rental: Rental;
}

const RentalDetails = (props: Props) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Detail de la Location</DialogTitle>
        <DialogDescription>
          Concernant la location : {props.rental.id}
        </DialogDescription>
      </DialogHeader>
      <div className="grid grid-cols-5 gap-4">
        <p className="col-span-2">Date de début: </p>
        <p className="col-span-3">
          {new Date(props.rental.rentalStartDate).toLocaleDateString()}
        </p>

        <p className="col-span-2">Date de fin:</p>
        <p className="col-span-3">
          {new Date(props.rental.rentalEndDate).toLocaleDateString()}
        </p>

        <p className="col-span-2">Prix journalier:</p>
        <p className="col-span-3">{props.rental.dailyRate}€</p>

        <p className="col-span-2">Statut:</p>
        <p className="col-span-3">{props.rental.rentalStatus}</p>

        <p className="col-span-2">Moto:</p>
        <p className="col-span-3">{props.rental.motorcycleId}</p>

        <p className="col-span-2">Client:</p>
        <p className="col-span-3">{props.rental.renterId}</p>

        <p className="col-span-2">Date de retour:</p>
        <p className="col-span-3">
          {props.rental.returnDate
            ? new Date(props.rental.returnDate).toLocaleDateString()
            : "Non retournée"}
        </p>
      </div>

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

export default RentalDetails;
