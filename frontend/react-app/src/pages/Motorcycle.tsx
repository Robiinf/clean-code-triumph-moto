import { DataTable } from "@/components/DataTable";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";

// icons
import BreakdownList from "@/modals/BreakdownList";
import { GrHostMaintenance } from "react-icons/gr";
import { LuWrench } from "react-icons/lu";
import {
  MdOutlineModeEdit,
  MdOutlineRemoveRedEye,
  MdOutlineAddHomeWork,
} from "react-icons/md";
import { IoDocumentTextOutline } from "react-icons/io5";

//components
import { Button } from "@/components/ui/button";
import MotorcycleDetails from "@/modals/MotorcycleDetails";
import MotorcycleForm from "@/modals/MotorcycleForm";

//types
import type { Motorcycle } from "@/types/Motorcycle";
import { MotorcycleformSchema } from "@/types/zod/MotorcycleFormSchema";
import { z } from "zod";
import MaintenanceOnMotorcycle from "@/modals/MaintenanceOnMotorcycle";
import BreakdownForm from "@/modals/BreakdownForm";
import WarrantyList from "@/modals/WarrantyList";
import WarrantyForm from "@/modals/WarrantyForm";

const Motorcycle = () => {
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [selectedMotorcycle, setSelectedMotorcycle] =
    useState<Motorcycle | null>(null);
  const [actionType, setActionType] = useState<
    | "view"
    | "edit"
    | "add"
    | "maintenance"
    | "breakdown"
    | "warranty"
    | "addBreakdown"
    | "addWarranty"
    | null
  >(null);

  const fetchMotorcycles = async () => {
    try {
      const response = await fetch("http://localhost:3001/motorcycles");
      const data = await response.json();
      setMotorcycles(data);
    } catch (error) {
      console.error("Erreur lors du chargement des motos :", error);
    }
  };

  useEffect(() => {
    // Fetch motorcycles from the API
    fetchMotorcycles();
  }, []);

  const onCreateSubmit = (values: z.infer<typeof MotorcycleformSchema>) => {
    const reponse = fetch("http://localhost:3001/motorcycles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    // Fetch motorcycles from the API
    reponse.then(() => fetchMotorcycles());

    closeDialog();
  };

  const onEditSubmit = (values: z.infer<typeof MotorcycleformSchema>) => {
    const reponse = fetch(
      `http://localhost:3001/motorcycles/${selectedMotorcycle?.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }
    );

    // Fetch motorcycles from the API
    reponse.then(() => fetchMotorcycles());

    closeDialog();
  };

  const openDialog = (
    motorcycle: Motorcycle | null,
    action:
      | "view"
      | "add"
      | "edit"
      | "maintenance"
      | "breakdown"
      | "addBreakdown"
      | "warranty"
      | "addWarranty"
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
      cell: ({ row }) => {
        return <div className="tracking-widest">{row.original.vin.value}</div>;
      },
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
      cell: ({ row }) => {
        return (
          <div
            className={
              row.original.status === "available"
                ? "text-green-400"
                : "text-rose-400"
            }
          >
            {row.original.status === "available"
              ? "Disponible"
              : "Indisponible"}
          </div>
        );
      },
    },
    {
      accessorKey: "mileageInKilometers",
      header: "Kilometrage",
      cell: ({ row }) => {
        return <div>{row.original.mileageInKilometers.value} km</div>;
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

            <button
              className="text-sky-500"
              onClick={() => openDialog(motorcycle, "edit")}
            >
              <MdOutlineModeEdit />
            </button>

            <button
              className="text-cyan-500"
              onClick={() => openDialog(motorcycle, "warranty")}
            >
              <IoDocumentTextOutline />
            </button>

            <button
              className="text-orange-500"
              onClick={() => openDialog(motorcycle, "breakdown")}
            >
              <LuWrench />
            </button>

            <button
              className="text-rose-700"
              onClick={() => openDialog(motorcycle, "addBreakdown")}
            >
              <MdOutlineAddHomeWork />
            </button>

            <button
              className="text-orange-500"
              onClick={() => openDialog(motorcycle, "maintenance")}
            >
              <GrHostMaintenance />
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
            <MotorcycleDetails motorcycle={selectedMotorcycle} />
          )}

          {selectedMotorcycle && actionType === "edit" && (
            <MotorcycleForm
              closeDialog={closeDialog}
              onSubmit={onEditSubmit}
              selectedMotorcycle={selectedMotorcycle}
            />
          )}

          {actionType === "add" && (
            <MotorcycleForm
              closeDialog={closeDialog}
              onSubmit={onCreateSubmit}
              selectedMotorcycle={null}
            />
          )}

          {selectedMotorcycle && actionType === "maintenance" && (
            <MaintenanceOnMotorcycle motorcycle={selectedMotorcycle} />
          )}

          {selectedMotorcycle && actionType === "warranty" && (
            <WarrantyList
              motorcycle={selectedMotorcycle}
              setActionType={setActionType}
            />
          )}

          {selectedMotorcycle && actionType === "addWarranty" && (
            <WarrantyForm
              motorcycle={selectedMotorcycle}
              onSubmit={() => {}}
              closeDialog={closeDialog}
            />
          )}

          {selectedMotorcycle && actionType === "addBreakdown" && (
            <BreakdownForm
              closeDialog={closeDialog}
              motorcycleId={selectedMotorcycle.id}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Motorcycle;
