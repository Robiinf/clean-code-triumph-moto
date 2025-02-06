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

interface SquarePart {
  id: string;
  name: string;
  unit_price: number;
  description: string;
}

interface Stock {
  id: string;
  square_part: SquarePart;
  quantity: number;
  alertLevel: number;
}

const data: SquarePart[] = [
  {
    id: "1",
    name: "Pneu",
    unit_price: 100,
    description: "Pneu de 18 pouces",
  },
  {
    id: "2",
    name: "Frein",
    unit_price: 50,
    description: "Frein à disque",
  },
  {
    id: "3",
    name: "Huile",
    unit_price: 10,
    description: "Huile 5W30",
  },
];

const stocksData: Stock[] = [
  {
    id: "1",
    square_part: data[0],
    quantity: 10,
    alertLevel: 5,
  },
  {
    id: "2",
    square_part: data[1],
    quantity: 5,
    alertLevel: 2,
  },
  {
    id: "3",
    square_part: data[2],
    quantity: 20,
    alertLevel: 10,
  },
];

const SquarePart = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [actionType, setActionType] = useState<
    "view" | "edit" | "add" | "delete" | "stock" | null
  >(null);

  useEffect(() => {
    setStocks(stocksData);
  }, []);

  const openDialog = (
    stock: Stock | null,
    action: "view" | "add" | "edit" | "delete" | "stock"
  ) => {
    setSelectedStock(stock);
    setActionType(action);
  };

  const closeDialog = () => {
    setSelectedStock(null);
    setActionType(null);
  };

  const columns: ColumnDef<Stock>[] = [
    {
      accessorKey: "square_part",
      header: "Pièce",
      cell: ({ row }) => {
        const squarePart = row.original.square_part;
        return <p>{squarePart.name}</p>;
      },
    },
    {
      accessorKey: "quantity",
      header: "Quantité",
    },
    {
      accessorKey: "alertLevel",
      header: "Niveau d'alerte",
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
              onClick={() => openDialog(motorcycle, "stock")}
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
      <h1 className="text-4xl">Pièces</h1>
      <div className="w-full flex justify-end">
        <Button onClick={() => openDialog(null, "add")}>
          Ajouter une pièce
        </Button>
      </div>
      <div className="w-full py-8">
        <DataTable columns={columns} data={stocks} />
      </div>
      {/* Dialog avec contenu conditionnel */}
      <Dialog open={!!actionType} onOpenChange={closeDialog}>
        <DialogContent>
          {selectedStock && actionType === "stock" && (
            <div>
              <h2 className="text-lg font-bold">Voir le stock</h2>
              {/* Ajoute ici un formulaire pour modifier la moto */}
            </div>
          )}

          {selectedStock && actionType === "view" && (
            <div>
              <h2 className="text-lg font-bold">Détails du stock</h2>
            </div>
          )}

          {selectedStock && actionType === "edit" && (
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

          {selectedStock && actionType === "delete" && (
            <div>
              <h2 className="text-lg font-bold text-red-500">
                Supprimer le stock
              </h2>
              <p>
                Êtes-vous sûr de vouloir supprimer{" "}
                {selectedStock.square_part.name} ?
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

export default SquarePart;
