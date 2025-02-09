import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { IncidentFormSchema } from "@/types/zod/IncidentFormSchema";
import type { Driver } from "@/types/Driver";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Motorcycle } from "@/types/Motorcycle";
import { useEffect, useState } from "react";
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

interface Props {
  onSubmit: (values: z.infer<typeof IncidentFormSchema>) => void;
  selectedDriver: Driver | null;
  closeDialog: () => void;
}

const IncidentForm = (props: Props) => {
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);

  const fetchMotorcycles = async () => {
    try {
      const response = await fetch("http://localhost:3001/motorcycles");
      const data = await response.json();
      setMotorcycles(data);
    } catch (error) {
      console.error("Erreur lors du chargement des motos :", error);
    }
  };

  useEffect(() => {
    fetchMotorcycles();
  }, []);

  const form = useForm<z.infer<typeof IncidentFormSchema>>({
    resolver: zodResolver(IncidentFormSchema),
    defaultValues: {
      driverId: props.selectedDriver?.id,
      motorcycleId: "",
      incidentDate: "",
      incidentDetails: "",
    },
  });

  function onSubmit(values: z.infer<typeof IncidentFormSchema>) {
    props.onSubmit(values);
    props.closeDialog();
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Ajouter un incident</DialogTitle>
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

          <FormField
            control={form.control}
            name="incidentDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date de l'incident</FormLabel>
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
            name="incidentDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Détails de l'incident</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Détails de l'incident"
                    {...field}
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

export default IncidentForm;
