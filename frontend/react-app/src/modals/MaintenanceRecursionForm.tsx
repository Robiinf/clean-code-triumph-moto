import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { MaintenanceRecursionFormSchema } from "@/types/zod/MaintenanceRecursionFormSchema";
import { Motorcycle } from "@/types/Motorcycle";
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
  onSubmit: (values: z.infer<typeof MaintenanceRecursionFormSchema>) => void;
  motorcycle: Motorcycle | null;
  closeDialog: () => void;
}

const MaintenanceRecursionForm = (props: Props) => {
  const form = useForm<z.infer<typeof MaintenanceRecursionFormSchema>>({
    resolver: zodResolver(MaintenanceRecursionFormSchema),
    defaultValues: {
      motorcycleId: props.motorcycle?.id,
      description: "",
      intervalKm: 0,
      intervalMonths: 0,
    },
  });

  function onSubmit(values: z.infer<typeof MaintenanceRecursionFormSchema>) {
    props.onSubmit(values);
    props.closeDialog();
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Ajouter une récurrence de maintenance</DialogTitle>
        <DialogDescription>
          Veuillez remplir tous les champs obligatoires
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Changement de l'huile moteur"
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
            name="intervalKm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Intervalle (en km)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="10000"
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
          <FormField
            control={form.control}
            name="intervalMonths"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Intervalle (en mois)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="6"
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

export default MaintenanceRecursionForm;
