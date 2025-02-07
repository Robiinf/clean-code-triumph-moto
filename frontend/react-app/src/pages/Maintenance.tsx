import { DataTable } from "@/components/DataTable";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";

// icons
import { FaMotorcycle } from "react-icons/fa";
import { MdOutlineModeEdit, MdOutlineRemoveRedEye } from "react-icons/md";

//Entity
import { Button } from "@/components/ui/button";
import MaintenanceForm from "@/modals/MaintenanceForm";
import MaintenanceDetails from "@/modals/MaintenanceDetails";
import MotorcycleOnMaintenace from "@/modals/MotorcycleOnMaintenace";
import type { Maintenance } from "@/types/Maintenance";
import { MaintenanceformSchema } from "@/types/zod/MaintenanceFormSchema";
import { z } from "zod";

const Maintenance = () => {
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [selectedMaintenance, setSelectedMaintenance] =
    useState<Maintenance | null>(null);
  const [actionType, setActionType] = useState<
    "view" | "edit" | "add" | "motorcycle" | null
  >(null);

  useEffect(() => {
    const fetchMaintenances = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/maintenances");
        const data = await response.json();
        setMaintenances(data.data);
      } catch (error) {
        console.error("Erreur lors du chargement des entreprises :", error);
      }
    };

    fetchMaintenances();
  }, []);

  const openDialog = (
    maintenance: Maintenance | null,
    action: "view" | "edit" | "add" | "motorcycle"
  ) => {
    setSelectedMaintenance(maintenance);
    setActionType(action);
  };

  const closeDialog = () => {
    setSelectedMaintenance(null);
    setActionType(null);
  };

  function onCreateSubmit(values: z.infer<typeof MaintenanceformSchema>) {
    const response = fetch("http://localhost:3000/api/maintenances", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    response.then(async (res) => {
      const data = await res.json();
      setMaintenances((prev) => [...prev, data.data]);
    });

    closeDialog();
  }

  function onEditSubmit(values: z.infer<typeof MaintenanceformSchema>) {
    console.log(values);
    const response = fetch(
      `http://localhost:3000/api/maintenances/${selectedMaintenance?.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }
    );

    response.then(async (res) => {
      const data = await res.json();
      setMaintenances((prev) =>
        prev.map((maintenance) =>
          maintenance.id === data.data.id ? data.data : maintenance
        )
      );
    });

    closeDialog();
  }

  const columns: ColumnDef<Maintenance>[] = [
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        const date = new Date(row.original.maintenanceDate);
        return <p>{date?.toLocaleDateString()}</p>;
      },
    },
    {
      accessorKey: "maintenanceType",
      header: "Type",
      cell: ({ row }) => {
        return <p>{row.original.maintenanceType.value}</p>;
      },
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
              className="text-orange-500"
              onClick={() => openDialog(maintenance, "motorcycle")}
            >
              <FaMotorcycle />
            </button>

            <button
              className="text-sky-500"
              onClick={() => openDialog(maintenance, "edit")}
            >
              <MdOutlineModeEdit />
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
          {selectedMaintenance && actionType === "motorcycle" && (
            <MotorcycleOnMaintenace maintenance={selectedMaintenance} />
          )}

          {selectedMaintenance && actionType === "view" && (
            <MaintenanceDetails maintenance={selectedMaintenance} />
          )}

          {selectedMaintenance && actionType === "edit" && (
            <MaintenanceForm
              selectedMaintenance={selectedMaintenance}
              onSubmit={onEditSubmit}
              closeDialog={closeDialog}
              setMaintenances={setMaintenances}
            />
          )}

          {actionType === "add" && (
            <MaintenanceForm
              selectedMaintenance={null}
              onSubmit={onCreateSubmit}
              closeDialog={closeDialog}
              setMaintenances={setMaintenances}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Maintenance;
