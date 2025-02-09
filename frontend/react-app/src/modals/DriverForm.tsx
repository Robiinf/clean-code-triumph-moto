import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DriverFormSchema } from "@/types/zod/DriverFormSchema";
import type { Driver } from "@/types/Driver";
import { useForm } from "react-hook-form";
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

interface Props {
  onSubmit: (values: z.infer<typeof DriverFormSchema>) => void;
  selectedDriver: Driver | null;
  closeDialog: () => void;
  companyId: string;
}

const DriverForm = (props: Props) => {
  const displayDate = props.selectedDriver?.birthDate
    ? new Date(props.selectedDriver?.birthDate).toISOString().split("T")[0]
    : "";

  const form = useForm<z.infer<typeof DriverFormSchema>>({
    resolver: zodResolver(DriverFormSchema),
    defaultValues: {
      firstName: props.selectedDriver?.firstName || "",
      lastName: props.selectedDriver?.lastName || "",
      phone: props.selectedDriver?.phone || "",
      email: props.selectedDriver?.email || "",
      birthDate: displayDate,
      companyId: props.companyId,
    },
  });

  function onSubmit(values: z.infer<typeof DriverFormSchema>) {
    props.onSubmit(values);
    props.closeDialog();
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {props.selectedDriver
            ? "Modifier le conducteur"
            : "Ajouter un conducteur"}
        </DialogTitle>
        <DialogDescription>
          Veuillez remplir tous les champs obligatoires
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prenom</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Pierre"
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
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Dupont"
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
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Téléphone</FormLabel>
                <FormControl>
                  <Input
                    placeholder="0123456789"
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="pierredupont@mail.com"
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
            name="birthDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date de naissance</FormLabel>
                <FormControl>
                  <Input
                    placeholder="2002-01-01"
                    {...field}
                    className="tracking-widest placeholder:tracking-normal"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter className="sm:justify-start">
            <Button type="submit">
              {props.selectedDriver ? "Modifier" : "Créer"}
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

export default DriverForm;
