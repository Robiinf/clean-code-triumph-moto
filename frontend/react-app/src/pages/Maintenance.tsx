{
  /*  
import { DataTable } from "@/components/DataTable";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";

// icons
import { LuWrench } from "react-icons/lu";
import {
  MdDeleteOutline,
  MdOutlineModeEdit,
  MdOutlineRemoveRedEye,
} from "react-icons/md";

//Entity
import { MaintenanceEntity } from "../../../../../domain/entities/maintenance";
import { Mileage } from "../../../../../domain/types/mileage";
import { Button } from "@/components/ui/button";

const data: Partial<MaintenanceEntity>[] = [
  {
    date: new Date(),
    type: "Accident Repair",
    recommendation: "Vidange",
    technician_fullname: "Jean Dupont",
    mileage: Mileage.from(100000) as Mileage,
  },
  {
    date: new Date(),
    type: "Preventive Maintenance",
    recommendation: "Vidange",
    technician_fullname: "Jean Dupont",
    mileage: Mileage.from(300000) as Mileage,
  },
  {
    date: new Date(),
    type: "Accident Repair",
    recommendation: "Vidange",
    technician_fullname: "Jean Dupont",
    mileage: Mileage.from(200000) as Mileage,
  },
];

const Maintenance = () => {
  const [maintenances, setMaintenances] = useState<
    Partial<MaintenanceEntity>[]
  >([]);
  const [selectedMaintenance, setSelectedMaintenance] =
    useState<Partial<MaintenanceEntity> | null>(null);
  const [actionType, setActionType] = useState<
    "view" | "edit" | "add" | "delete" | "breakdown" | null
  >(null);

  useEffect(() => {
    setMaintenances(data);
  }, []);

  const openDialog = (
    maintenance: Partial<MaintenanceEntity> | null,
    action: "view" | "edit" | "add" | "delete" | "breakdown"
  ) => {
    setSelectedMaintenance(maintenance);
    setActionType(action);
  };

  const closeDialog = () => {
    setSelectedMaintenance(null);
    setActionType(null);
  };

  const columns: ColumnDef<Partial<MaintenanceEntity>>[] = [
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        const date = row.original.date;
        return <p>{date?.toLocaleDateString()}</p>;
      },
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      accessorKey: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const maintenance = row.original;
        return (
          <div className="flex justify-end space-x-2">
            <button
              className="text-green-500"
              onClick={() => openDialog(maintenance, "view")}
            >
              <MdOutlineRemoveRedEye />
            </button>

            <button
              className="text-sky-500"
              onClick={() => openDialog(maintenance, "edit")}
            >
              <MdOutlineModeEdit />
            </button>

            <button
              className="text-orange-500"
              onClick={() => openDialog(maintenance, "breakdown")}
            >
              <LuWrench />
            </button>


            <button
              className="text-rose-500"
              onClick={() => openDialog(maintenance, "delete")}
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
      <h1 className="text-4xl">Maintenances</h1>
      <div className="w-full flex justify-end">
        <Button onClick={() => openDialog(null, "add")}>
          Ajouter une maintenance
        </Button>
      </div>
      <div className="w-full py-8">
        <DataTable columns={columns} data={maintenances} />
      </div>

      <Dialog open={!!actionType} onOpenChange={closeDialog}>
        <DialogContent>
          {selectedMaintenance && actionType === "breakdown" && <div></div>}

          {selectedMaintenance && actionType === "view" && (
            <div>
              <h2 className="text-lg font-bold">Détails de la maintenance</h2>
              <p>
                {selectedMaintenance.date?.toDateString()} -{" "}
                {selectedMaintenance.type}
              </p>
            </div>
          )}

          {selectedMaintenance && actionType === "edit" && (
            <div>
              <h2 className="text-lg font-bold">Modifier la maintenance</h2>

            </div>
          )}

          {actionType === "add" && (
            <div>
              <h2 className="text-lg font-bold">Ajouter une Maintenance</h2>

            </div>
          )}

          {selectedMaintenance && actionType === "delete" && (
            <div>
              <h2 className="text-lg font-bold text-red-500">
                Supprimer la maintenance
              </h2>
              <p>
                Êtes-vous sûr de vouloir supprimer {selectedMaintenance.type} ?
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

export default Maintenance; */
}
