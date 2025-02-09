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
import { Motorcycle } from "@/types/Motorcycle";
import { MotorcycleformSchema } from "@/types/zod/MotorcycleFormSchema";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface Props {
  onSubmit: (values: z.infer<typeof MotorcycleformSchema>) => void;
  selectedMotorcycle: Motorcycle | null;
  closeDialog: () => void;
}

const MotorcycleForm = (props: Props) => {
  const form = useForm<z.infer<typeof MotorcycleformSchema>>({
    resolver: zodResolver(MotorcycleformSchema),
    defaultValues: {
      vin: props.selectedMotorcycle?.vin.value || "",
      model: props.selectedMotorcycle?.model || "",
      year: props.selectedMotorcycle?.year || 0,
      status: props.selectedMotorcycle?.status || "",
      mileageInKilometers:
        props.selectedMotorcycle?.mileageInKilometers.value || 0,
      motorcycleType: props.selectedMotorcycle?.motorcycleType.value || "",
      power: props.selectedMotorcycle?.power || 0,
      fuelType: props.selectedMotorcycle?.fuelType.value || "",
      transmission: props.selectedMotorcycle?.transmission || "",
      fuelTankCapacityInLiters:
        props.selectedMotorcycle?.fuelTankCapacityInLiters.value || 0,
    },
  });

  function onSubmit(values: z.infer<typeof MotorcycleformSchema>) {
    props.onSubmit(values);
    props.closeDialog();
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {props.selectedMotorcycle ? "Modifier une moto" : "Ajouter une moto"}
        </DialogTitle>
        <DialogDescription>
          Veuillez remplir tous les champs obligatoires
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="vin"
            disabled={!!props.selectedMotorcycle}
            render={({ field }) => (
              <FormItem>
                <FormLabel>VIN (Numéro d'Identification du Véhicule)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Numéro d'Identification du Véhicule"
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
            name="motorcycleType"
            render={({ field }) => (
              <Select
                disabled={!!props.selectedMotorcycle}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormItem>
                  <FormLabel>Type du Véhicule</FormLabel>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectionner un type de Moto" />
                  </SelectTrigger>
                  <FormControl>
                    <SelectContent>
                      <SelectItem value={"Cruiser"}>Cruiser</SelectItem>
                      <SelectItem value={"Touring"}>Touring</SelectItem>
                      <SelectItem value={"Adventure"}>Adventure</SelectItem>
                      <SelectItem value={"Sportbike"}>Sportbike</SelectItem>
                      <SelectItem value={"Naked"}>Naked</SelectItem>
                      <SelectItem value={"Scrambler"}>Scrambler</SelectItem>
                      <SelectItem value={"Café Racer"}>Café Racer</SelectItem>
                      <SelectItem value={"Bobber"}>Bobber</SelectItem>
                      <SelectItem value={"Classic / Modern Classic"}>
                        Classic / Modern Classic
                      </SelectItem>
                      <SelectItem value={"Dirt Bike"}>Dirt Bike</SelectItem>
                      <SelectItem value={"Supermoto"}>Supermoto</SelectItem>
                      <SelectItem value={"Electric Motorcycle"}>
                        Electric Motorcycle
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
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modèle</FormLabel>
                <FormControl>
                  <Input
                    disabled={!!props.selectedMotorcycle}
                    placeholder="Model du Véhicule"
                    {...field}
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
                  <FormLabel>Statut du Véhicule</FormLabel>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectionner un statut pour la Moto" />
                  </SelectTrigger>
                  <FormControl>
                    <SelectContent>
                      <SelectItem
                        className="text-green-400"
                        value={"available"}
                      >
                        Disponible
                      </SelectItem>
                      <SelectItem
                        className="text-rose-400"
                        value={"unavailable"}
                      >
                        Indisponible
                      </SelectItem>
                    </SelectContent>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </Select>
            )}
          />

          <div className="flex space-x-4 w-full items-center justify-between">
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Année</FormLabel>
                  <FormControl>
                    <Input
                      disabled={!!props.selectedMotorcycle}
                      type="number"
                      placeholder="Année de la Moto"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mileageInKilometers"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Kilometrage (Kilometre)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Kilometrage en Kilometre"
                      type="number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex space-x-4 w-full items-center justify-between">
            <FormField
              control={form.control}
              name="fuelType"
              render={({ field }) => (
                <FormItem className="w-full max-w-full">
                  <Select
                    disabled={!!props.selectedMotorcycle}
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
                      <SelectItem value={"Unleaded Gas"}>
                        Essence Sans plomb
                      </SelectItem>
                      <SelectItem value={"Ethanol-Blended Gasoline"}>
                        Essence mélangée à de l'éthanol
                      </SelectItem>
                      <SelectItem value={"Diesel"}>Diesel</SelectItem>
                      <SelectItem value={"Electric"}>Électrique</SelectItem>
                      <SelectItem value={"Hybrid"}>Hybride</SelectItem>
                      <SelectItem value={"Biofuel"}>Biocarburant</SelectItem>
                      <SelectItem value={"Compressed Natural Gas"}>
                        Gaz Naturel Comprimé
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fuelTankCapacityInLiters"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Taille du Réservoir (Litre)</FormLabel>
                  <FormControl>
                    <Input
                      disabled={!!props.selectedMotorcycle}
                      placeholder="Taille du réservoir"
                      type="number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex space-x-4 w-full items-center justify-between">
            <FormField
              control={form.control}
              name="power"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Puissance (Chevaux)</FormLabel>
                  <FormControl>
                    <Input
                      disabled={!!props.selectedMotorcycle}
                      type="number"
                      placeholder="Puissance en Chevaux"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="transmission"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Transmission</FormLabel>
                  <FormControl>
                    <Input
                      disabled={!!props.selectedMotorcycle}
                      placeholder="Type de Transmission"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <DialogFooter className="sm:justify-start">
            <Button type="submit">
              {props.selectedMotorcycle ? "Modifier" : "Créer"}
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

export default MotorcycleForm;
