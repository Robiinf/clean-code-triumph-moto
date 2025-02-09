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

import { SparePart } from "@/types/SquarePart";
import { SparePartformSchema } from "@/types/zod/SparePartFormSchema";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  onSubmit: (values: z.infer<typeof SparePartformSchema>) => void;
  selectedSparePart: SparePart | null;
  closeDialog: () => void;
}

const SparePartForm = (props: Props) => {
  const form = useForm<z.infer<typeof SparePartformSchema>>({
    resolver: zodResolver(SparePartformSchema),
    defaultValues: {
      name: props.selectedSparePart?.name ?? "",
      unitPrice: props.selectedSparePart?.unitPrice ?? 0,
      description: props.selectedSparePart?.description ?? "",
      stockQuantity: props.selectedSparePart?.stockQuantity ?? 0,
      alertLowStock: props.selectedSparePart?.alertLowStock ?? 0,
    },
  });

  function onSubmit(values: z.infer<typeof SparePartformSchema>) {
    props.onSubmit(values);
    props.closeDialog();
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {props.selectedSparePart ? "Modifier la Pièce" : "Ajouter une Pièce"}
        </DialogTitle>
        <DialogDescription>
          Veuillez remplir tous les champs obligatoires
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input placeholder="Nom" {...field} />
                </FormControl>
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
                    placeholder="Description de la pièce"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="alertLowStock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seuil d'alerte</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Valeur du Seuil"
                      type="number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="unitPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prix à l'unité</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Prix à l'unité"
                      type="number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="stockQuantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantité</FormLabel>
                <FormControl>
                  <Input placeholder="Quantité" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter className="sm:justify-start">
            <Button type="submit">
              {props.selectedSparePart ? "Modifier" : "Ajouter"}
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

export default SparePartForm;
