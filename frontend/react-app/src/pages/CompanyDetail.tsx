import { z } from "zod";
import { useParams } from "react-router-dom";
import React, { useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/DataTable";
import DriverForm from "@/modals/DriverForm";
import { DriverFormSchema } from "@/types/zod/DriverFormSchema";
import LicenseForm from "@/modals/LicenseForm";
import { LicenseFormSchema } from "@/types/zod/LicenseFormSchema";
import IncidentsOnDriver from "@/modals/IncidentsOnDriver";
import IncidentForm from "@/modals/IncidentForm";
import { IncidentFormSchema } from "@/types/zod/IncidentFormSchema";

// icons
import {
  MdOutlineModeEdit,
  MdOutlineCarCrash,
  MdOutlineCreditCard,
  MdOutlineDesignServices,
} from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
    | "edit"
    | "add"
    | "driver"
    | "license"
    | "viewIncidents"
    | "addIncident"
    | null
  >(null);

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

    fetchCompany();
    fetchDrivers();
  }, [id]);

  const onCreateSubmit = (values: z.infer<typeof DriverFormSchema>) => {
    const response = fetch(`http://localhost:3000/api/drivers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    response.then(() => fetchDrivers());

    closeDialog();
  };

  const onUpdateSubmit = (values: z.infer<typeof DriverFormSchema>) => {
    const response = fetch(
      `http://localhost:3000/api/drivers/${selectedDriver?.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }
    );

    response.then(() => fetchDrivers());
    closeDialog();
  };

  const onLicenseSubmit = (values: z.infer<typeof LicenseFormSchema>) => {
    const response = fetch(`http://localhost:3000/api/driver-licenses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    response.then(() => fetchDrivers());
    closeDialog();
  };

  const onIncidentSubmit = (values: z.infer<typeof IncidentFormSchema>) => {
    const response = fetch(`http://localhost:3000/api/incidents`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    response.then(() => fetchDrivers());
    closeDialog();
  };

  const openDialog = (
    driver: Driver | null,
    action:
      | "edit"
      | "add"
      | "driver"
      | "license"
      | "viewIncidents"
      | "addIncident"
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
      accessorKey: "phone",
      header: "Téléphone",
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
        const driver = row.original;
        return (
          <div className="flex justify-end space-x-2">
            <button
              className="text-sky-500"
              onClick={() => openDialog(driver, "edit")}
            >
              <MdOutlineModeEdit />
            </button>

            {driver.driverLicenseId == null && (
              <button
                className="text-yellow-500"
                onClick={() => openDialog(driver, "license")}
              >
                <MdOutlineCreditCard />
              </button>
            )}
            <button
              className="text-red-500"
              onClick={() => openDialog(driver, "addIncident")}
            >
              <MdOutlineCarCrash />
            </button>
            <button
              className="text-slate-600"
              onClick={() => openDialog(driver, "viewIncidents")}
            >
              <MdOutlineDesignServices />
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
        <Dialog open={!!actionType} onOpenChange={closeDialog}>
          <DialogContent>
            {selectedDriver && actionType === "driver" && <div></div>}

            {selectedDriver && actionType === "edit" && (
              <div>
                <DriverForm
                  closeDialog={closeDialog}
                  onSubmit={onUpdateSubmit}
                  selectedDriver={selectedDriver}
                  companyId={company?.id}
                />
              </div>
            )}

            {selectedDriver && actionType === "license" && (
              <div>
                <LicenseForm
                  closeDialog={closeDialog}
                  onSubmit={onLicenseSubmit}
                  selectedDriver={selectedDriver}
                />
              </div>
            )}

            {selectedDriver && actionType === "addIncident" && (
              <IncidentForm
                closeDialog={closeDialog}
                selectedDriver={selectedDriver}
                onSubmit={onIncidentSubmit}
              />
            )}

            {selectedDriver && actionType === "viewIncidents" && (
              <IncidentsOnDriver driver={selectedDriver} />
            )}

            {actionType === "add" && (
              <div>
                <DriverForm
                  closeDialog={closeDialog}
                  onSubmit={onCreateSubmit}
                  selectedDriver={null}
                  companyId={company?.id}
                />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
