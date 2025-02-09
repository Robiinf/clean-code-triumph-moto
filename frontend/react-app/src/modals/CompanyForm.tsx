import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CompanyformSchema } from "@/types/zod/CompanyFormSchema";
import type { Company } from "@/types/Company";
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
  onSubmit: (values: z.infer<typeof CompanyformSchema>) => void;
  selectedCompany: Company | null;
  closeDialog: () => void;
}

const CompanyForm = (props: Props) => {
  const form = useForm<z.infer<typeof CompanyformSchema>>({
    resolver: zodResolver(CompanyformSchema),
    defaultValues: {
      name: props.selectedCompany?.name || "",
      siret: props.selectedCompany?.siret || "",
      phone: props.selectedCompany?.phone || "",
      address: props.selectedCompany?.address || "",
      city: props.selectedCompany?.city || "",
      postalCode: props.selectedCompany?.postalCode || "",
      country: props.selectedCompany?.country || "",
    },
  });

  function onSubmit(values: z.infer<typeof CompanyformSchema>) {
    props.onSubmit(values);
    props.closeDialog();
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {props.selectedCompany
            ? "Modifier l'entreprise"
            : "Créer une entreprise"}
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
                  <Input
                    placeholder="Apple"
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
            name="siret"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Siret</FormLabel>
                <FormControl>
                  <Input
                    placeholder="12345678901234"
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
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresse</FormLabel>
                <FormControl>
                  <Input
                    placeholder="1 Infinite Loop"
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
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ville</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Cupertino"
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
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code postal</FormLabel>
                <FormControl>
                  <Input
                    placeholder="95014"
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
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pays</FormLabel>
                <FormControl>
                  <Input
                    placeholder="USA"
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
              {props.selectedCompany ? "Modifier" : "Créer"}
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

export default CompanyForm;
