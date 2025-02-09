import { Textarea } from "@/components/ui/textarea";
import { Motorcycle } from "@/types/Motorcycle";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Maintenance } from "@/types/Maintenance";
import { MaintenanceformSchema } from "@/types/zod/MaintenanceFormSchema";
import { Breakdown } from "@/types/Breakdown";

interface Props {
  onSubmit: (values: z.infer<typeof MaintenanceformSchema>) => void;
  selectedMaintenance: Maintenance | null;
  closeDialog: () => void;
}

const translateBreakdownType = {
  Frame: "Cadre",
  Engine: "Moteur",
  Fuel: "Carburant",
  Brakes: "Freins",
  "Wheels and Tire": "Roues et Pneus",
  Battery: "Batterie",
  Electrical: "Electrique",
  Suspension: "Suspension",
  Transmission: "Transmission",
  Handlebars: "Guidon",
};

const MaintenanceForm = (props: Props) => {
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [breakdowns, setBreakdowns] = useState<Breakdown[]>([]);

  const formatDate = (date: Date) => {
    return (
      (date.getFullYear() < 10
        ? "0" + date.getFullYear().toString()
        : date.getFullYear().toString()) +
      "-" +
      (date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1).toString()
        : (date.getMonth() + 1).toString()) +
      "-" +
      (date.getDate()
        ? "0" + date.getDate().toString()
        : date.getDate().toString())
    );
  };

  const fetchBreakdowns = async (motorcycleId: string) => {
    console.log(motorcycleId);
    const response = await fetch(
      `http://localhost:3000/api/motorcycles/${motorcycleId}/breakdowns`
    );
    const data = await response.json();
    console.log(data);
    setBreakdowns(data.data);
  };

  useEffect(() => {
    if (props.selectedMaintenance) {
      fetchBreakdowns(props.selectedMaintenance.motorcycleId);
    }

    const fetchMotorcycles = async () => {
      const response = await fetch("http://localhost:3001/motorcycles");
      const data = await response.json();
      setMotorcycles(data);
    };

    fetchMotorcycles();
  }, [props.selectedMaintenance]);

  const form = useForm<z.infer<typeof MaintenanceformSchema>>({
    resolver: zodResolver(MaintenanceformSchema),
    defaultValues: {
      motorcycleId: props.selectedMaintenance?.motorcycleId || "",
      maintenanceType: props.selectedMaintenance?.maintenanceType.value || "",
      maintenanceDate: props.selectedMaintenance?.maintenanceDate
        ? formatDate(new Date(props.selectedMaintenance?.maintenanceDate))
        : formatDate(new Date()),
      description: props.selectedMaintenance?.description || "",
      breakdownId: props.selectedMaintenance?.breakdownId || "",
      techniciansRecommendation:
        props.selectedMaintenance?.techniciansRecommendation || "",
      currentMotorcycleMileage:
        props.selectedMaintenance?.currentMotorcycleMileage.value || 0,
    },
  });

  function onSubmit(values: z.infer<typeof MaintenanceformSchema>) {
    props.onSubmit(values);
    props.closeDialog();
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {props.selectedMaintenance
            ? "Modifier la Maintenance"
            : "Créer une Maintenance"}
        </DialogTitle>
        <DialogDescription>
          Veuillez remplir tous les champs obligatoires
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="motorcycleId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Moto</FormLabel>
                <Select
                  disabled={!!props.selectedMaintenance}
                  onValueChange={(value) => {
                    field.onChange(value);
                    fetchBreakdowns(value);
                  }}
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
            name="breakdownId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Accident</FormLabel>
                <FormDescription>Optionnel</FormDescription>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={!!props.selectedMaintenance}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selectionner un Accident" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {breakdowns.length ? (
                      breakdowns.map((breakdown) => (
                        <SelectItem key={breakdown.id} value={breakdown.id}>
                          {new Date(
                            breakdown.breakdownDate
                          ).toLocaleDateString()}{" "}
                          -{" "}
                          {
                            translateBreakdownType[
                              breakdown.breakdownType.value
                            ]
                          }
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled value="Pas d'accident">
                        Pas d'accident
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maintenanceType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de maintenance</FormLabel>
                <Select
                  disabled={!!props.selectedMaintenance}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selectionner un type de maintenance" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Preventive">Preventive</SelectItem>
                    <SelectItem value="Corrective">Corrective</SelectItem>
                    <SelectItem value="Predictive">Predictive</SelectItem>
                    <SelectItem value="Adjustive">Adjustive</SelectItem>
                    <SelectItem value="Evolutionary">Evolutionary</SelectItem>
                    <SelectItem value="Condition-based">
                      Condition-based
                    </SelectItem>
                    <SelectItem value="Legal and Mandatory">
                      Legal and Mandatory
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Description de la maintenance"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="techniciansRecommendation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recommendation du Technicien</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Recommendation du Technicien"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currentMotorcycleMileage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kilometrage</FormLabel>
                <FormControl>
                  <Input
                    disabled={!!props.selectedMaintenance}
                    type="number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter className="sm:justify-start">
            <Button type="submit">
              {props.selectedMaintenance ? "Modifier" : "Créer"}
            </Button>
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

export default MaintenanceForm;
