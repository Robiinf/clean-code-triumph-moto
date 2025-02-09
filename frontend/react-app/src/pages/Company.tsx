import React, { useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/DataTable";
import { useNavigate } from "react-router-dom";
import z from "zod";
import CompanyForm from "@/modals/CompanyForm";
import { CompanyformSchema } from "@/types/zod/CompanyFormSchema";
import type { Company } from "@/types/Company";

// icons
import { MdOutlineModeEdit, MdOutlineRemoveRedEye } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const Company = () => {
  const [companies, setCompanies] = React.useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = React.useState<Company | null>(
    null
  );
  const [actionType, setActionType] = React.useState<
    "view" | "edit" | "add" | "delete" | "company" | null
  >(null);

  const navigate = useNavigate();

  const fetchCompanies = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/companies");
      const data = await response.json();
      setCompanies(data.data);
    } catch (error) {
      console.error("Erreur lors du chargement des entreprises :", error);
    }
  };
  useEffect(() => {
    fetchCompanies();
  }, []);

  const openDialog = (
    company: Company | null,
    action: "edit" | "add" | "company"
  ) => {
    setSelectedCompany(company);
    setActionType(action);
  };

  const closeDialog = () => {
    setSelectedCompany(null);
    setActionType(null);
  };

  const onEditSubmit = (values: z.infer<typeof CompanyformSchema>) => {
    const reponse = fetch(
      `http://localhost:3000/api/companies/${selectedCompany?.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }
    );

    reponse.then(() => fetchCompanies());

    closeDialog();
  };

  const onCreateSubmit = (values: z.infer<typeof CompanyformSchema>) => {
    const reponse = fetch("http://localhost:3000/api/companies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    reponse.then(() => fetchCompanies());

    closeDialog();
  };

  const columns: ColumnDef<Company>[] = [
    {
      accessorKey: "name",
      header: "Nom",
    },
    {
      accessorKey: "siret",
      header: "Siret",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "address",
      header: "Adresse",
    },
    {
      accessorKey: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const company = row.original;
        return (
          <div className="flex justify-end space-x-2">
            {/* Bouton Voir */}
            <button
              className="text-green-500"
              onClick={() => navigate(`/company/${company.id}`)}
            >
              <MdOutlineRemoveRedEye />
            </button>

            {/* Bouton Modifier */}
            <button
              className="text-sky-500"
              onClick={() => openDialog(company, "edit")}
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
      <h1 className="text-4xl">Entreprises</h1>
      <div className="w-full flex justify-end">
        <Button onClick={() => openDialog(null, "add")}>
          Ajouter une Entreprise
        </Button>
      </div>
      <div className="w-full py-8">
        <DataTable columns={columns} data={companies} />
      </div>
      <Dialog open={!!actionType} onOpenChange={closeDialog}>
        <DialogContent>
          {selectedCompany && actionType === "company" && <div></div>}

          {selectedCompany && actionType === "edit" && (
            <div>
              <CompanyForm
                closeDialog={closeDialog}
                onSubmit={onEditSubmit}
                selectedCompany={selectedCompany}
              />
            </div>
          )}

          {actionType === "add" && (
            <div>
              <CompanyForm
                closeDialog={closeDialog}
                onSubmit={onCreateSubmit}
                selectedCompany={null}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Company;
