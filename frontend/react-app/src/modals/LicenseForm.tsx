import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LicenseFormSchema } from "@/types/zod/LicenseFormSchema";
import type { Driver } from "@/types/Driver";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface Props {
  onSubmit: (values: z.infer<typeof LicenseFormSchema>) => void;
  selectedDriver: Driver | null;
  closeDialog: () => void;
}

const LicenseForm = (props: Props) => {
  const form = useForm<z.infer<typeof LicenseFormSchema>>({
    resolver: zodResolver(LicenseFormSchema),
    defaultValues: {
      licenseNumber: "",
      issueDate: "",
      expirationDate: "",
      status: "",
      categories: [],
      driverId: props.selectedDriver?.id,
    },
  });

  function onSubmit(values: z.infer<typeof LicenseFormSchema>) {
    props.onSubmit(values);
    props.closeDialog();
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {props.selectedDriver ? "Modifier la licence" : "Ajouter une license"}
        </DialogTitle>
        <DialogDescription>
          Veuillez remplir tous les champs obligatoires
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="licenseNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numero de license</FormLabel>
                <FormControl>
                  <Input
                    placeholder="12345678"
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
            name="issueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date de délivrance</FormLabel>
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
            name="expirationDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date d'expiration</FormLabel>
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
            name="status"
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormItem>
                  <FormLabel>Statut</FormLabel>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectionner un statut" />
                  </SelectTrigger>
                  <FormControl>
                    <SelectContent>
                      <SelectItem className="text-green-400" value={"Active"}>
                        Active
                      </SelectItem>
                      <SelectItem className="text-rose-400" value={"Inactive"}>
                        Inactive
                      </SelectItem>
                    </SelectContent>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </Select>
            )}
          />

          <FormField
            control={form.control}
            name="categories"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Catégories</FormLabel>
                <FormControl>
                  <div className="grid grid-cols-2 gap-2">
                    {["A", "B", "C", "D"].map((category) => (
                      <div
                        key={category}
                        className="flex items-center space-x-2 border p-2 rounded-lg"
                      >
                        <Checkbox
                          checked={field.value?.includes(category)}
                          onCheckedChange={(checked) => {
                            form.setValue(
                              "categories",
                              checked
                                ? [...(field.value || []), category]
                                : field.value.filter(
                                    (c: string) => c !== category
                                  )
                            );
                          }}
                        />
                        <span className="text-gray-800">{category}</span>
                      </div>
                    ))}
                  </div>
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
export default LicenseForm;
