import { DataTable } from "@/components/DataTable";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Rental } from "@/types/Rental";
import ReturnRentalForm from "@/modals/ReturnRentalForm";
import { ReturnRentalFormSchema } from "@/types/zod/ReturnRentalFormSchema";
import RentalDetails from "@/modals/RentalDetails";
import RentalForm from "@/modals/RentalForm";
import { RentalFormSchema } from "@/types/zod/RentalFormSchema";
import { z } from "zod";
import {
  MdOutlineAssignmentReturn,
  MdOutlineRemoveRedEye,
} from "react-icons/md";
import { Button } from "@/components/ui/button";

const Rentals = () => {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);
  const [actionType, setActionType] = useState<
    "edit" | "add" | "return" | "view" | null
  >(null);

  const fetchRentals = async () => {
    try {
      const response = await fetch(" http://localhost:3000/api/rentals");
      const data = await response.json();
      setRentals(data.data);
    } catch (error) {
      console.error("Erreur lors du chargement des locations :", error);
    }
  };

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

  useEffect(() => {
    fetchRentals();
  }, []);

  const onRentalSubmit = (values: z.infer<typeof RentalFormSchema>) => {
    const reponse = fetch("http://localhost:3000/api/rentals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    reponse.then(() => fetchRentals());

    closeDialog();
  };

  const onRentalReturnSubmit = (
    values: z.infer<typeof ReturnRentalFormSchema>
  ) => {
    const reponse = fetch(
      `http://localhost:3000/api/rentals/${selectedRental?.id}/return`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }
    );

    reponse.then(() => fetchRentals());

    closeDialog();
  };

  const openDialog = (
    rental: Rental | null,
    action: "add" | "edit" | "return" | "view"
  ) => {
    setSelectedRental(rental);
    setActionType(action);
  };

  const closeDialog = () => {
    setSelectedRental(null);
    setActionType(null);
  };

  const columns: ColumnDef<Rental>[] = [
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
    {
      accessorKey: "rentalStartDate",
      header: "Date de debut de location",
      cell: ({ row }) => {
        const date = new Date(row.original.rentalStartDate);
        return date.toLocaleDateString("fr-FR");
      },
    },
    {
      accessorKey: "rentalEndDate",
      header: "Date de fin de location",
      cell: ({ row }) => {
        const date = new Date(row.original.rentalEndDate);
        return date.toLocaleDateString("fr-FR");
      },
    },
    {
      accessorKey: "returnDate",
      header: "Date de retour",
      cell: ({ row }) => {
        if (!row.original.returnDate) {
          return "Non retournée";
        }
        const date = new Date(row.original.returnDate);
        return date.toLocaleDateString("fr-FR");
      },
    },
    {
      accessorKey: "dailyRate",
      header: "Prix journalier",
    },
    {
      accessorKey: "rentalStatus",
      header: "Statut",
    },
    {
      accessorKey: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const rental = row.original;
        return (
          <div className="flex justify-end space-x-2">
            <button
              className="text-green-500"
              onClick={() => openDialog(rental, "view")}
            >
              <MdOutlineRemoveRedEye />
            </button>

            {!rental.returnDate && (
              <button
                className="text-sky-500"
                onClick={() => openDialog(rental, "edit")}
              >
                <MdOutlineAssignmentReturn />
              </button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-4 w-full">
      <h1 className="text-4xl">Locations</h1>
      <div className="w-full flex justify-end">
        <Button onClick={() => openDialog(null, "add")}>
          Ajouter une location
        </Button>
      </div>
      <div className="w-full py-8">
        <DataTable columns={columns} data={rentals} />
      </div>

      <Dialog open={!!actionType} onOpenChange={closeDialog}>
        <DialogContent>
          {selectedRental && actionType === "edit" && (
            <ReturnRentalForm
              selectedRental={selectedRental}
              onSubmit={onRentalReturnSubmit}
              closeDialog={closeDialog}
            />
          )}

          {selectedRental && actionType === "view" && (
            <RentalDetails rental={selectedRental} />
          )}

          {actionType === "add" && (
            <RentalForm
              selectedRental={null}
              onSubmit={onRentalSubmit}
              closeDialog={closeDialog}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default Rentals;
