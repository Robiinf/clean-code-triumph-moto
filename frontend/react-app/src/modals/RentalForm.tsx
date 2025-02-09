import { z } from "zod";
import { RentalFormSchema } from "@/types/zod/RentalFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Rental } from "@/types/Rental";
import { useEffect, useState } from "react";
import { Motorcycle } from "@/types/Motorcycle";
import { Company } from "@/types/Company";
import { Driver } from "@/types/Driver";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  selectedRental: Rental | null;
  onSubmit: (values: z.infer<typeof RentalFormSchema>) => void;
  closeDialog: () => void;
}

const RentalForm = (props: Props) => {
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null
  );

  const fetchMotorcycles = async () => {
    try {
      const response = await fetch("http://localhost:3001/motorcycles");
      const data = await response.json();
      setMotorcycles(data);
    } catch (error) {
      console.error("Erreur lors du chargement des motos :", error);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/companies");
      const data = await response.json();
      setCompanies(data.data);
    } catch (error) {
      console.error("Erreur lors du chargement des entreprises :", error);
    }
  };

  const fetchDriversByCompany = async (companyId: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/companies/${companyId}/drivers`
      );
      const data = await response.json();
      setDrivers(data.data);
    } catch (error) {
      console.error("Erreur lors du chargement des conducteurs :", error);
    }
  };

  useEffect(() => {
    fetchMotorcycles();
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (selectedCompanyId) {
      fetchDriversByCompany(selectedCompanyId);
    } else {
      setDrivers([]);
    }
  }, [selectedCompanyId]);

  const form = useForm<z.infer<typeof RentalFormSchema>>({
    resolver: zodResolver(RentalFormSchema),
    defaultValues: {
      motorcycleId: "",
      renterId: "",
      rentalStartDate: "",
      rentalEndDate: "",
      dailyRate: 0,
    },
  });

  function onSubmit(values: z.infer<typeof RentalFormSchema>) {
    props.onSubmit(values);
    props.closeDialog();
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Ajouter une location</DialogTitle>
        <DialogDescription>
          Veuillez remplir tous les champs obligatoires
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="motorcycleId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Moto</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selectionner une Moto" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {motorcycles.map((motorcycle) => (
                      <SelectItem key={motorcycle.id} value={motorcycle.id}>
                        {motorcycle.vin.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>Entreprise</FormLabel>
            <Select
              onValueChange={(value) => setSelectedCompanyId(value)}
              defaultValue=""
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une Entreprise" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>

          <FormField
            control={form.control}
            name="renterId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Locataire</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  disabled={!selectedCompanyId || drivers.length === 0}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          selectedCompanyId
                            ? "Sélectionner un conducteur"
                            : "Sélectionner une entreprise d'abord"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {drivers.map((driver) => (
                      <SelectItem key={driver.id} value={driver.id}>
                        {driver.firstName} {driver.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rentalStartDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date de début de location</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    className="tracking-widest placeholder:tracking-normal"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rentalEndDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date de fin de location</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    className="tracking-widest placeholder:tracking-normal"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dailyRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prix journalier</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : ""
                      )
                    }
                    className="tracking-widest placeholder:tracking-normal"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter className="sm:justify-start">
            <Button type="submit">Créer</Button>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Fermer
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};

export default RentalForm;
