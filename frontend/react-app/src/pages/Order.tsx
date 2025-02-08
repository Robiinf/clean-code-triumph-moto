import { DataTable } from "@/components/DataTable";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";

// icons
import { Button } from "@/components/ui/button";
import SparePartForm from "@/modals/SparePartForm";
import type { SparePart } from "@/types/SparePart";
import { SparePartformSchema } from "@/types/zod/SparePartFormSchema";
import { MdOutlineModeEdit, MdOutlineRemoveRedEye } from "react-icons/md";
import { z } from "zod";
import type { Order } from "@/types/Order";
import OrderDetail from "@/modals/OrderDetail";

const Order = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [actionType, setActionType] = useState<"view" | "edit" | "add" | null>(
    null
  );

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/orders");
      const data = await response.json();
      setOrders(data.data);
    } catch (error) {
      console.error("Erreur lors du chargement des motos :", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const openDialog = (order: Order | null, action: "view" | "add" | "edit") => {
    setSelectedOrder(order);
    setActionType(action);
  };

  const closeDialog = () => {
    setSelectedOrder(null);
    setActionType(null);
  };

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "orderDate",
      header: "Date de la commande",
      cell: ({ row }) => {
        return new Date(row.original.orderDate).toLocaleDateString();
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const translateTable = {
          pending: "En attente",
          confirmed: "Confirmée",
          delivered: "Livré",
          cancelled: "Annulé",
        };

        return translateTable[row.original.status];
      },
    },

    {
      accessorKey: "totalAmount",
      header: "Montant total",
      cell: ({ row }) => {
        return `${row.original.totalAmount} €`;
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
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-4 w-full">
      <h1 className="text-4xl">Commandes</h1>
      <div className="w-full flex justify-end gap-x-4"></div>
      <div className="w-full py-8">
        <DataTable columns={columns} data={orders} />
      </div>
      <Dialog open={!!actionType} onOpenChange={closeDialog}>
        <DialogContent>
          {selectedOrder && actionType === "view" && (
            <OrderDetail order={selectedOrder} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Order;
