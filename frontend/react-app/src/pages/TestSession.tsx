import React, { useEffect } from "react";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/DataTable";
import { TestSession } from "@/types/TestSession";
import { z } from "zod";
import { TestSessionFormSchema } from "@/types/zod/TestSessionFormSchema";
import TestSessionForm from "@/modals/TestSessionForm";

// icons
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export const Company = () => {
  const [tests, setTests] = React.useState<TestSession[]>([]);
  const [selectedTest, setSelectedTest] = React.useState<TestSession | null>(
    null
  );
  const [actionType, setActionType] = React.useState<
    "view" | "edit" | "add" | "delete" | null
  >(null);

  const getMotorcycleVINById = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3001/motorcycles/${id}`);
      const data = await response.json();
      return data.vin.value;
    } catch (error) {
      console.error("Erreur lors de la récupération de la moto :", error);
      return "Inconnu";
    }
  };

  const fetchTests = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/test-drives");
      const data = await response.json();
      setTests(data.data);
    } catch (error) {
      console.error("Erreur lors du chargement des sessions de test :", error);
    }
  };

  const onCreateSubmit = async (
    values: z.infer<typeof TestSessionFormSchema>
  ) => {
    const reponse = fetch("http://localhost:3000/api/test-drives", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    reponse.then(() => fetchTests());

    closeDialog();
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const openDialog = (
    maintenance: TestSession | null,
    action: "view" | "edit" | "add" | "delete"
  ) => {
    setSelectedTest(maintenance);
    setActionType(action);
  };

  const closeDialog = () => {
    setSelectedTest(null);
    setActionType(null);
  };

  const columns: ColumnDef<TestSession>[] = [
    {
      accessorKey: "sessionDate",
      header: "Date",
      cell: ({ row }) => {
        const date = new Date(row.original.sessionDate);
        return date.toLocaleDateString("fr-FR");
      },
    },
    {
      accessorKey: "sessionDetails",
      header: "Détails",
    },
    {
      accessorKey: "driverId",
      header: "Conducteur",
    },
    {
      accessorKey: "motorcycleId",
      header: "Moto",
      cell: ({ row }) => {
        const rental = row.original;
        const [motorcycle, setMotorcycle] = useState<string | null>(null);

        useEffect(() => {
          getMotorcycleVINById(rental.motorcycleId).then(setMotorcycle);
        }, [rental.motorcycleId]);

        return <span>{motorcycle || "Chargement..."}</span>;
      },
    },
  ];

  return (
    <div className="p-4 w-full">
      <h1 className="text-4xl">Sessions de Test</h1>
      <div className="w-full flex justify-end">
        <Button onClick={() => openDialog(null, "add")}>
          Ajouter une Session
        </Button>
      </div>
      <div className="w-full py-8">
        <DataTable columns={columns} data={tests} />
      </div>
      {/* Dialog avec contenu conditionnel */}
      <Dialog open={!!actionType} onOpenChange={closeDialog}>
        <DialogContent>
          {actionType === "add" && (
            <TestSessionForm
              closeDialog={closeDialog}
              onSubmit={onCreateSubmit}
              selectedTest={null}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Company;
