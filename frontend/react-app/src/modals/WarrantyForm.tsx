import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { WarrantyformSchema } from "@/types/zod/WarrantyFormSchema";
import { Motorcycle } from "@/types/Motorcycle";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  motorcycle: Motorcycle;
  onSubmit: (values: z.infer<typeof WarrantyformSchema>) => void;
  closeDialog: () => void;
}

const WarrantyForm = (props: Props) => {
  const form = useForm<z.infer<typeof WarrantyformSchema>>({
    resolver: zodResolver(WarrantyformSchema),
    defaultValues: {
      startDate: "",
      endDate: "",
      warrantyType: undefined,
      warrantyDescription: "",
      motorcyleId: props.motorcycle.id,
    },
  });

  function onSubmit(values: z.infer<typeof WarrantyformSchema>) {
    fetch("http://localhost:3000/api/warranties", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    props.closeDialog();
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Créer une garantie</DialogTitle>
        <DialogDescription>
          Veuillez remplir tous les champs obligatoires
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date de début</FormLabel>
                  <FormControl>
                    <Input placeholder="AAAA-MM-JJ" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date de fin</FormLabel>
                  <FormControl>
                    <Input placeholder="AAAA-MM-JJ" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="warrantyType"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormLabel>Type de Carburant</FormLabel>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selectionner un type de carburant" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={"Garantie constructeur"}>
                      Garantie constructeur
                    </SelectItem>
                    <SelectItem value={"Garantie moteur et transmission"}>
                      Garantie moteur et transmission
                    </SelectItem>
                    <SelectItem value={"Garantie pièces et main-d’œuvre"}>
                      Garantie pièces et main-d’œuvre
                    </SelectItem>
                    <SelectItem value={"Garantie kilométrique"}>
                      Garantie kilométrique
                    </SelectItem>
                    <SelectItem value={"Garantie contre la corrosion"}>
                      Garantie contre la corrosion
                    </SelectItem>
                    <SelectItem value={"Garantie batterie"}>
                      Garantie batterie
                    </SelectItem>
                    <SelectItem value={"Garantie suspension et amortisseurs"}>
                      Garantie suspension et amortisseurs
                    </SelectItem>
                    <SelectItem value={"Garantie électronique"}>
                      Garantie électronique
                    </SelectItem>
                    <SelectItem value={"Garantie accessoires"}>
                      Garantie accessoires
                    </SelectItem>
                    <SelectItem value={"Garantie pneumatiques"}>
                      Garantie pneumatiques
                    </SelectItem>
                    <SelectItem value={"Garantie peinture et esthétique"}>
                      Garantie peinture et esthétique
                    </SelectItem>
                    <SelectItem value={"Garantie extension de service"}>
                      Garantie extension de service
                    </SelectItem>
                    <SelectItem value={"Garantie accident et vol"}>
                      Garantie accident et vol
                    </SelectItem>
                    <SelectItem value={"Garantie occasion / seconde main"}>
                      Garantie occasion / seconde main
                    </SelectItem>
                    <SelectItem value={"Garantie dépannage et assistance"}>
                      Garantie dépannage et assistance
                    </SelectItem>
                    <SelectItem value={"Garantie usage piste"}>
                      Garantie usage piste
                    </SelectItem>
                    <SelectItem value={"Garantie équipements du pilote"}>
                      Garantie équipements du pilote
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="warrantyDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Description de la garantie"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <DialogFooter className="sm:justify-start">
            <Button type="submit">Ajouter</Button>
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

export default WarrantyForm;
