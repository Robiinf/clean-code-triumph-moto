import { useParams } from "react-router-dom";
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
import type { Company } from "@/types/Company";
import type { Driver } from "@/types/Driver";

export default function CompanyDetail() {
  const { id } = useParams();
  const [company, setCompany] = React.useState<Company | null>(null);
  const [drivers, setDrivers] = React.useState<Driver[]>([]);
  const [selectedDriver, setSelectedDriver] = React.useState<Driver | null>(
    null
  );
  const [actionType, setActionType] = React.useState<
    "view" | "edit" | "add" | "delete" | "driver" | null
  >(null);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/companies/${id}`
        );
        const data = await response.json();
        setCompany(data.data);
      } catch (error) {
        console.error("Erreur lors du chargement des entreprises :", error);
      }
    };

    const fetchDrivers = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/companies/${id}/drivers`
        );
        const data = await response.json();
        setDrivers(data.data);
      } catch (error) {
        console.error("Erreur lors du chargement des entreprises :", error);
      }
    };

    fetchCompany();
    fetchDrivers();
  }, [id]);

  const openDialog = (
    driver: Driver | null,
    action: "view" | "edit" | "add" | "delete" | "driver"
  ) => {
    setSelectedDriver(driver);
    setActionType(action);
  };

  const closeDialog = () => {
    setSelectedDriver(null);
    setActionType(null);
  };

  const columns: ColumnDef<Driver>[] = [
    {
      accessorKey: "firstName",
      header: "Prenom",
    },
    {
      accessorKey: "lastName",
      header: "Nom",
    },
    {
      accessorKey: "birthDate",
      header: "Date de naissance",
      cell: ({ row }) => {
        const date = new Date(row.original.birthDate);
        return date.toLocaleDateString("fr-FR");
      },
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "driverLicenseId",
      header: "License",
      cell: ({ row }) => {
        const driverLicense = row.original.driverLicenseId;
        const bgColor = driverLicense ? "bg-green-500" : "bg-red-500";
        const text = driverLicense || "None";

        return (
          <div className="flex justify-left items-center space-x-2">
            <span
              className={`px-2 py-1 rounded text-white font-bold ${bgColor}`}
            >
              {text}
            </span>
          </div>
        );
      },
    },

    {
      accessorKey: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        //const driver = row.original;
        return (
          <div className="flex justify-end space-x-2">
            {/* Bouton Voir */}
            <button className="text-green-500" onClick={() => {}}>
              <MdOutlineRemoveRedEye />
            </button>

            {/* Bouton Modifier */}
            <button className="text-sky-500" onClick={() => {}}>
              <MdOutlineModeEdit />
            </button>

            {/* Bouton Pannes */}
            <button className="text-orange-500" onClick={() => {}}>
              <LuWrench />
            </button>

            {/* Bouton Supprimer */}
            <button className="text-rose-500" onClick={() => {}}>
              <MdDeleteOutline />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="max-w-6xl mt-8 mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-800">{company?.name}</h1>
        <Button>Modifier</Button>
      </div>

      {company && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center space-x-2">
            <span className="text-gray-500">SIRET :</span>
            <span className="text-gray-900 font-medium">{company.siret}</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-gray-500">Téléphone :</span>
            <span className="text-gray-900 font-medium">{company.phone}</span>
          </div>

          <div className="flex items-start space-x-2">
            <span className="text-gray-500">Adresse :</span>
            <span className="text-gray-900 font-medium">{company.address}</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-gray-500">City :</span>
            <span className="text-gray-900 font-medium">{company.city}</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-gray-500">Postal Code :</span>
            <span className="text-gray-900 font-medium">
              {company.postalCode}
            </span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-gray-500">Country :</span>
            <span className="text-gray-900 font-medium">{company.country}</span>
          </div>
        </div>
      )}

      <div className="p-4 w-full mt-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl">Conducteurs</h1>
          <div className="w-full flex justify-end">
            <Button onClick={() => openDialog(null, "add")}>
              Ajouter un conducteur
            </Button>
          </div>
        </div>
        <div className="w-full py-8">
          <DataTable columns={columns} data={drivers} />
        </div>
        {/* Dialog avec contenu conditionnel */}
        <Dialog open={!!actionType} onOpenChange={closeDialog}>
          <DialogContent>
            {selectedDriver && actionType === "driver" && <div></div>}

            {selectedDriver && actionType === "view" && (
              <div>
                <h2 className="text-lg font-bold">Détails de l'entreprise</h2>
              </div>
            )}

            {selectedDriver && actionType === "edit" && (
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

            {selectedDriver && actionType === "delete" && (
              <div>
                <h2 className="text-lg font-bold text-red-500">
                  Supprimer l'entreprise
                </h2>
                <p>Êtes-vous sûr de vouloir supprimer ?</p>
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
    </div>
  );
}
