import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Textarea } from "@/components/ui/textarea";

import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BreakdownformSchema } from "@/types/zod/BreakdownFormSchema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface Props {
  motorcycleId: string;
  closeDialog: () => void;
}

export const BreakdownForm = (props: Props) => {
  const form = useForm<z.infer<typeof BreakdownformSchema>>({
    resolver: zodResolver(BreakdownformSchema),
    defaultValues: {
      breakdownDate: "",
      breakdownType: undefined,
      breakdownDescription: "",
      motorcycleId: props.motorcycleId,
    },
  });

  function onSubmit(values: z.infer<typeof BreakdownformSchema>) {
    const propsToSend = {
      ...values,
      breakdownDate: format(values.breakdownDate, "yyyy-MM-dd"),
    };

    fetch("http://localhost:3000/api/breakdowns", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(propsToSend),
    });

    props.closeDialog();
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Ajouter une Panne / Incident</DialogTitle>
        <DialogDescription>
          Veuillez remplir tous les champs obligatoires
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="breakdownDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date de la panne</FormLabel>
                <FormControl>
                  <Input
                    placeholder="2025-10-01"
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
            name="breakdownType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de Panne</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selectionner un Accident" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={"Frame"}>
                      <span>Cadre</span>
                    </SelectItem>
                    <SelectItem value={"Engine"}>
                      <span>Moteur</span>
                    </SelectItem>
                    <SelectItem value={"Fuel"}>
                      <span>Carburant</span>
                    </SelectItem>
                    <SelectItem value={"Brakes"}>
                      <span>Freins</span>
                    </SelectItem>
                    <SelectItem value={"Wheels and Tire"}>
                      <span>Roues et Pneus</span>
                    </SelectItem>
                    <SelectItem value={"Battery"}>
                      <span>Batterie</span>
                    </SelectItem>
                    <SelectItem value={"Electrical"}>
                      <span>Electrique</span>
                    </SelectItem>
                    <SelectItem value={"Suspension"}>
                      <span>Suspension</span>
                    </SelectItem>
                    <SelectItem value={"Transmission"}>
                      <span>Transmission</span>
                    </SelectItem>
                    <SelectItem value={"Handlebars"}>
                      <span>Guidon</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="breakdownDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Description de la panne"
                    className="resize-none"
                    {...field}
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
export default BreakdownForm;
