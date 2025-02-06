import { DataTable } from "@/components/DataTable";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";

// icons
import BreakdownList from "@/modals/BreakdownList";
import { LuWrench } from "react-icons/lu";
import {
  MdDeleteOutline,
  MdOutlineModeEdit,
  MdOutlineRemoveRedEye,
} from "react-icons/md";
import { Button } from "@/components/ui/button";

interface Motorcycle {
  vin: string;
  model: string;
  year: number;
  status: string;
  mileage: number;
}

const data: Motorcycle[] = [
  {
    vin: "1HGCM82633A001234",
    model: "Civic",
    year: 2003,
    status: "Active",
    mileage: 100000,
  },
  {
    vin: "1HGCM82633A001235",
    model: "Accord",
    year: 2004,
    status: "Active",
    mileage: 200000,
  },
  {
    vin: "1HGCM82633A001236",
    model: "CR-V",
    year: 2005,
    status: "Inactive",
    mileage: 300000,
  },
];

const Motorcycle = () => {
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [selectedMotorcycle, setSelectedMotorcycle] =
    useState<Motorcycle | null>(null);
  const [actionType, setActionType] = useState<
    "view" | "edit" | "add" | "delete" | "breakdown" | null
  >(null);

  useEffect(() => {
    setMotorcycles(data);
  }, []);

  const openDialog = (
    motorcycle: Motorcycle | null,
    action: "view" | "add" | "edit" | "delete" | "breakdown"
  ) => {
    setSelectedMotorcycle(motorcycle);
    setActionType(action);
  };

  const closeDialog = () => {
    setSelectedMotorcycle(null);
    setActionType(null);
  };

  const columns: ColumnDef<Motorcycle>[] = [
    {
      accessorKey: "vin",
      header: "VIN",
    },
    {
      accessorKey: "model",
      header: "Modele",
    },
    {
      accessorKey: "year",
      header: "Année",
    },
    {
      accessorKey: "status",
      header: "Statut",
    },
    {
      accessorKey: "mileage",
      header: "Kilometrage",
      cell: ({ row }) => {
        return <div>{row.getValue("mileage")} km</div>;
      },
    },
    {
      accessorKey: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const motorcycle = row.original;
        return (
          <div className="flex justify-end space-x-2">
            {/* Bouton Voir */}
            <button
              className="text-green-500"
              onClick={() => openDialog(motorcycle, "view")}
            >
              <MdOutlineRemoveRedEye />
            </button>

            {/* Bouton Modifier */}
            <button
              className="text-sky-500"
              onClick={() => openDialog(motorcycle, "edit")}
            >
              <MdOutlineModeEdit />
            </button>

            {/* Bouton Pannes */}
            <button
              className="text-orange-500"
              onClick={() => openDialog(motorcycle, "breakdown")}
            >
              <LuWrench />
            </button>

            {/* Bouton Supprimer */}
            <button
              className="text-rose-500"
              onClick={() => openDialog(motorcycle, "delete")}
            >
              <MdDeleteOutline />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-4 w-full">
      <h1 className="text-4xl">Motos</h1>
      <div className="w-full flex justify-end">
        <Button onClick={() => openDialog(null, "add")}>
          Ajouter une Moto
        </Button>
      </div>
      <div className="w-full py-8">
        <DataTable columns={columns} data={motorcycles} />
      </div>
      {/* Dialog avec contenu conditionnel */}
      <Dialog open={!!actionType} onOpenChange={closeDialog}>
        <DialogContent>
          {selectedMotorcycle && actionType === "breakdown" && (
            <BreakdownList motorcycle={selectedMotorcycle} />
          )}

          {selectedMotorcycle && actionType === "view" && (
            <div>
              <h2 className="text-lg font-bold">Détails de la moto</h2>
              <p>Modèle: {selectedMotorcycle.model}</p>
              <p>Année: {selectedMotorcycle.year}</p>
              <p>Statut: {selectedMotorcycle.status}</p>
              <p>KM: {selectedMotorcycle.mileage} km</p>
            </div>
          )}

          {selectedMotorcycle && actionType === "edit" && (
            <div>
              <h2 className="text-lg font-bold">Modifier la moto</h2>
              {/* Ajoute ici un formulaire pour modifier la moto */}
            </div>
          )}

          {actionType === "add" && (
            <div>
              <h2 className="text-lg font-bold">Ajouter la moto</h2>
              {/* Ajoute ici un formulaire pour modifier la moto */}
            </div>
          )}

          {selectedMotorcycle && actionType === "delete" && (
            <div>
              <h2 className="text-lg font-bold text-red-500">
                Supprimer la moto
              </h2>
              <p>
                Êtes-vous sûr de vouloir supprimer {selectedMotorcycle.model} ?
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  className="bg-gray-200 p-2 rounded"
                  onClick={closeDialog}
                >
                  Annuler
                </button>
                <button className="bg-red-500 text-white p-2 rounded">
                  Supprimer
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Motorcycle;
