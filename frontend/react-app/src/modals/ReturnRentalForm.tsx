import { z } from "zod";
import { Rental } from "@/types/Rental";
import { ReturnRentalFormSchema } from "@/types/zod/ReturnRentalFormSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  selectedRental: Rental | null;
  onSubmit: (values: z.infer<typeof ReturnRentalFormSchema>) => void;
  closeDialog: () => void;
}

const ReturnRentalForm = (props: Props) => {
  const form = useForm<z.infer<typeof ReturnRentalFormSchema>>({
    resolver: zodResolver(ReturnRentalFormSchema),
    defaultValues: {
      returnDate: "",
    },
  });

  function onSubmit(values: z.infer<typeof ReturnRentalFormSchema>) {
    props.onSubmit(values);
    props.closeDialog();
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Retourner une location</DialogTitle>
        <DialogDescription>
          Veuillez remplir tous les champs obligatoires
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="returnDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date de retour</FormLabel>
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

          <DialogFooter className="sm:justify-start">
            <Button type="submit">Modifier</Button>
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

export default ReturnRentalForm;
