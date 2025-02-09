import { DataTable } from "@/components/DataTable";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";


// icons
import { Button } from "@/components/ui/button";
import SparePartForm from "@/modals/SparePartForm";
import type { SparePart } from "@/types/SquarePart";
import { SparePartformSchema } from "@/types/zod/SparePartFormSchema";
import { MdOutlineModeEdit, MdOutlineRemoveRedEye } from "react-icons/md";
import { z } from "zod";

const SparePart = () => {
  const [spareParts, setSpareParts] = useState<SparePart[]>([]);
  const [selectedSparePart, setSelectedSparePart] = useState<SparePart | null>(
    null
  );
  const [actionType, setActionType] = useState<"view" | "edit" | "add" | null>(
    null
  );

  const fetchSpareParts = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/spare-parts");
      const data = await response.json();
      setSpareParts(data.data);
    } catch (error) {
      console.error("Erreur lors du chargement des motos :", error);
    }
  };

  useEffect(() => {
    fetchSpareParts();
  }, []);

  const openDialog = (
    stock: SparePart | null,
    action: "view" | "add" | "edit"
  ) => {
    setSelectedSparePart(stock);
    setActionType(action);
  };

  const closeDialog = () => {
    setSelectedSparePart(null);
    setActionType(null);
  };

  const onEditSubmit = async (values: z.infer<typeof SparePartformSchema>) => {
    try {
      await fetch(
        `http://localhost:3000/api/spare-parts/${selectedSparePart?.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      fetchSpareParts();
    } catch (error) {
      console.error("Erreur lors de la modification de la pièce :", error);
    }
  };

  const onCreateSubmit = async (
    values: z.infer<typeof SparePartformSchema>
  ) => {
    try {
      await fetch("http://localhost:3000/api/spare-parts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      fetchSpareParts();
    } catch (error) {
      console.error("Erreur lors de la création de la pièce :", error);
    }
  };

  const columns: ColumnDef<SparePart>[] = [
    {
      accessorKey: "name",
      header: "Pièce",
    },
    {
      accessorKey: "stockQuantity",
      header: "Quantité",
    },
    {
      accessorKey: "alertLowStock",
      header: "Niveau d'alerte",
    },

    {
      accessorKey: "unitPrice",
      header: "Prix à l'unité",
      cell: ({ row }) => {
        return `${row.original.unitPrice} €`;
      },
    },
    {
      accessorKey: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const sparePart = row.original;
        return (
          <div className="flex justify-end space-x-2">
            {/* Bouton Voir */}
            <button
              className="text-green-500"
              onClick={() => openDialog(sparePart, "view")}
            >
              <MdOutlineRemoveRedEye />
            </button>

            {/* Bouton Modifier */}
            <button
              className="text-sky-500"
              onClick={() => openDialog(sparePart, "edit")}
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
      <h1 className="text-4xl">Pièces</h1>
      <div className="w-full flex justify-end gap-x-4">
        <Button onClick={() => window.open("http://localhost:5174")}>
          Commander des Pièces
        </Button>
        <Button onClick={() => openDialog(null, "add")}>
          Ajouter une pièce
        </Button>
      </div>
      <div className="w-full py-8">
        <DataTable columns={columns} data={spareParts} />
      </div>
      {/* Dialog avec contenu conditionnel */}
      <Dialog open={!!actionType} onOpenChange={closeDialog}>
        <DialogContent>
          {selectedSparePart && actionType === "view" && (
            <div>
              <h2 className="text-lg font-bold">Détails du stock</h2>
            </div>
          )}

          {selectedSparePart && actionType === "edit" && (
            <SparePartForm
              onSubmit={onEditSubmit}
              selectedSparePart={selectedSparePart}
              closeDialog={closeDialog}
            />
          )}

          {actionType === "add" && (
            <SparePartForm
              onSubmit={onCreateSubmit}
              selectedSparePart={null}
              closeDialog={closeDialog}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SparePart;
