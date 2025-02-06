import React, { useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/DataTable";

// icons
import {
  MdOutlineModeEdit,
  MdDeleteOutline,
  MdOutlineRemoveRedEye,
} from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { LuWrench } from "react-icons/lu";

interface Company {
  name: string;
  siret: string;
  type: string;
  address: string;
}

const data = [
  {
    name: "Company 1",
    siret: "123456789",
    type: "SAS",
    address: "1 rue de la paix",
  },
  {
    name: "Company 2",
    siret: "987654321",
    type: "SARL",
    address: "2 rue de la paix",
  },
  {
    name: "Company 3",
    siret: "123456789",
    type: "SAS",
    address: "3 rue de la paix",
  },
];

export const Company = () => {
  const [companies, setCompanies] = React.useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = React.useState<Company | null>(
    null
  );
  const [actionType, setActionType] = React.useState<
    "view" | "edit" | "add" | "delete" | "company" | null
  >(null);

  useEffect(() => {
    setCompanies(data);
  }, []);

  const openDialog = (
    maintenance: Company | null,
    action: "view" | "edit" | "add" | "delete" | "company"
  ) => {
    setSelectedCompany(maintenance);
    setActionType(action);
  };

  const closeDialog = () => {
    setSelectedCompany(null);
    setActionType(null);
  };

  const columns: ColumnDef<Company>[] = [
    {
      accessorKey: "name",
      header: "Nom",
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      accessorKey: "address",
      header: "Adresse",
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
              onClick={() => openDialog(motorcycle, "company")}
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
      <h1 className="text-4xl">Entreprises</h1>
      <div className="w-full flex justify-end">
        <Button onClick={() => openDialog(null, "add")}>
          Ajouter une Entreprise
        </Button>
      </div>
      <div className="w-full py-8">
        <DataTable columns={columns} data={companies} />
      </div>
      {/* Dialog avec contenu conditionnel */}
      <Dialog open={!!actionType} onOpenChange={closeDialog}>
        <DialogContent>
          {selectedCompany && actionType === "company" && <div></div>}

          {selectedCompany && actionType === "view" && (
            <div>
              <h2 className="text-lg font-bold">Détails de l'entreprise</h2>
            </div>
          )}

          {selectedCompany && actionType === "edit" && (
            <div>
              <h2 className="text-lg font-bold">Modifier l'entreprise</h2>
              {/* Ajoute ici un formulaire pour modifier la moto */}
            </div>
          )}

          {actionType === "add" && (
            <div>
              <h2 className="text-lg font-bold">Ajouter une Entreprise</h2>
              {/* Ajoute ici un formulaire pour modifier la moto */}
            </div>
          )}

          {selectedCompany && actionType === "delete" && (
            <div>
              <h2 className="text-lg font-bold text-red-500">
                Supprimer l'entreprise
              </h2>
              <p>Êtes-vous sûr de vouloir supprimer {selectedCompany.name} ?</p>
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

export default Company;
