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

interface Driver {
  id: string;
  first_name: string;
  last_name: string;
}

interface Motorcycle {
  id: string;
  vin: string;
  model: string;
  year: number;
  status: string;
  mileage: number;
}

interface TestSession {
  session_date: string;
  driver: Driver;
  motorcycle: Motorcycle;
  details: string;
}

const data = [
  {
    session_date: "2021-10-10",
    driver: {
      id: "1",
      first_name: "Jean",
      last_name: "Dupont",
    },
    motorcycle: {
      id: "1",
      vin: "1HGCM82633A001234",
      model: "Civic",
      year: 2003,
      status: "Active",
      mileage: 100000,
    },
    details: "Test session details",
  },
  {
    session_date: "2021-10-11",
    driver: {
      id: "2",
      first_name: "John",
      last_name: "Doe",
    },
    motorcycle: {
      id: "2",
      vin: "1HGCM82633A001235",
      model: "Accord",
      year: 2004,
      status: "Active",
      mileage: 200000,
    },
    details: "Test session details",
  },
  {
    session_date: "2021-10-12",
    driver: {
      id: "3",
      first_name: "Jane",
      last_name: "Doe",
    },
    motorcycle: {
      id: "3",
      vin: "1HGCM82633A001236",
      model: "CR-V",
      year: 2005,
      status: "Inactive",
      mileage: 300000,
    },
    details: "Test session details",
  },
];

export const Company = () => {
  const [tests, setTests] = React.useState<TestSession[]>([]);
  const [selectedTest, setSelectedTest] = React.useState<TestSession | null>(
    null
  );
  const [actionType, setActionType] = React.useState<
    "view" | "edit" | "add" | "delete" | null
  >(null);

  useEffect(() => {
    setTests(data);
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
      accessorKey: "session_date",
      header: "Date",
    },
    {
      accessorKey: "driver",
      header: "Conducteur",
      cell: ({ row }) => {
        const driver = row.original.driver;
        return <p>{`${driver.first_name} ${driver.last_name}`}</p>;
      },
    },
    {
      accessorKey: "motorcycle",
      header: "Moto",
      cell: ({ row }) => {
        const motorcycle = row.original.motorcycle;
        return <p>{`${motorcycle.model} (${motorcycle.vin})`}</p>;
      },
    },
    {
      accessorKey: "details",
      header: "Détails",
    },
    {
      accessorKey: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const test = row.original;
        return (
          <div className="flex justify-end space-x-2">
            {/* Bouton Voir */}
            <button
              className="text-green-500"
              onClick={() => openDialog(test, "view")}
            >
              <MdOutlineRemoveRedEye />
            </button>

            {/* Bouton Modifier */}
            <button
              className="text-sky-500"
              onClick={() => openDialog(test, "edit")}
            >
              <MdOutlineModeEdit />
            </button>

            {/* Bouton Supprimer */}
            <button
              className="text-rose-500"
              onClick={() => openDialog(test, "delete")}
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
          {selectedTest && actionType === "view" && (
            <div>
              <h2 className="text-lg font-bold">Détails de la session</h2>
            </div>
          )}

          {selectedTest && actionType === "edit" && (
            <div>
              <h2 className="text-lg font-bold">Modifier la session</h2>
              {/* Ajoute ici un formulaire pour modifier la moto */}
            </div>
          )}

          {actionType === "add" && (
            <div>
              <h2 className="text-lg font-bold">Ajouter une Session</h2>
              {/* Ajoute ici un formulaire pour modifier la moto */}
            </div>
          )}

          {selectedTest && actionType === "delete" && (
            <div>
              <h2 className="text-lg font-bold text-red-500">
                Supprimer la session
              </h2>
              <p>
                Êtes-vous sûr de vouloir supprimer {selectedTest.session_date} ?
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

export default Company;
