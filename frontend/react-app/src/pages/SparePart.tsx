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
import { Button } from "@/components/ui/button";
import type { SparePart } from "@/types/SparePart";

const SparePart = () => {
  const [spareParts, setSpareParts] = useState<SparePart[]>([]);
  const [selectedSparePart, setSelectedSparePart] = useState<SparePart | null>(
    null
  );
  const [actionType, setActionType] = useState<
    "view" | "edit" | "add" | "delete" | "stock" | null
  >(null);

  useEffect(() => {
    const fetchSpareParts = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/spare-parts");
        const data = await response.json();
        setSpareParts(data.data);
      } catch (error) {
        console.error("Erreur lors du chargement des motos :", error);
      }
    };

    fetchSpareParts();
  }, []);

  const openDialog = (
    stock: SparePart | null,
    action: "view" | "add" | "edit" | "delete" | "stock"
  ) => {
    setSelectedSparePart(stock);
    setActionType(action);
  };

  const closeDialog = () => {
    setSelectedSparePart(null);
    setActionType(null);
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

            {/* Bouton Pannes */}
            <button
              className="text-orange-500"
              onClick={() => openDialog(sparePart, "stock")}
            >
              <LuWrench />
            </button>

            {/* Bouton Supprimer */}
            <button
              className="text-rose-500"
              onClick={() => openDialog(sparePart, "delete")}
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
      <h1 className="text-4xl">Pièces</h1>
      <div className="w-full flex justify-end">
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
          {selectedSparePart && actionType === "stock" && (
            <div>
              <h2 className="text-lg font-bold">Voir le stock</h2>
              {/* Ajoute ici un formulaire pour modifier la moto */}
            </div>
          )}

          {selectedSparePart && actionType === "view" && (
            <div>
              <h2 className="text-lg font-bold">Détails du stock</h2>
            </div>
          )}

          {selectedSparePart && actionType === "edit" && (
            <div>
              <h2 className="text-lg font-bold">Modifier le sotck</h2>
              {/* Ajoute ici un formulaire pour modifier la moto */}
            </div>
          )}

          {actionType === "add" && (
            <div>
              <h2 className="text-lg font-bold">Ajouter du stock</h2>
              {/* Ajoute ici un formulaire pour modifier la moto */}
            </div>
          )}

          {selectedSparePart && actionType === "delete" && <div></div>}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SparePart;
