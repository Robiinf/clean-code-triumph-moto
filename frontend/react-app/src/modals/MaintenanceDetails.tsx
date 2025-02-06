import {
  DialogFooter,
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { Maintenance } from "@/types/Maintenance";

interface Props {
  maintenance: Maintenance;
}

const MaintenanceDetails = (props: Props) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Detail de la Moto</DialogTitle>
        <DialogDescription>
          Concernant la maintenance du :{" "}
          {new Date(props.maintenance.maintenanceDate).toLocaleDateString()}
        </DialogDescription>
      </DialogHeader>
      <div className="grid grid-cols-5 gap-4">
        <p className="col-span-2">Date: </p>
        <p className="col-span-3">
          {new Date(props.maintenance.maintenanceDate).toLocaleDateString()}
        </p>

        <p className="col-span-2">Type:</p>
        <p className="col-span-3">{props.maintenance.maintenanceType.value}</p>

        <p className="col-span-2">Description:</p>
        <p className="col-span-3">{props.maintenance.description}</p>

        <p className="col-span-2">Recommandation des techniciens:</p>
        <p className="col-span-3">
          {props.maintenance.techniciansRecommendation}
        </p>

        <p className="col-span-2">Mileage:</p>
        <p className="col-span-3">
          {props.maintenance.currentMotorcycleMileage.value}km
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

export default MaintenanceDetails;
