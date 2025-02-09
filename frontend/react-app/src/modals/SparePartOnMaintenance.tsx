import {
  DialogFooter,
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Maintenance } from "@/types/Maintenance";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MaintenanceSparePartformSchema } from "@/types/zod/MaintenanceSparePartFormSchema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { SparePart } from "@/types/SquarePart";
import { z } from "zod";

interface Props {
  maintenance: Maintenance;
  onSubmit: (values: z.infer<typeof MaintenanceSparePartformSchema>) => void;
}

const SparePartOnMaintenance = ({ maintenance, onSubmit }: Props) => {
  const [spareParts, setSpareParts] = useState<SparePart[]>([]);

  console.log(maintenance.replacedParts);

  const form = useForm({
    resolver: zodResolver(MaintenanceSparePartformSchema),
    defaultValues: {
      replacedParts: maintenance.replacedParts || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "replacedParts",
  });

  useEffect(() => {
    const fetchSpareParts = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/spare-parts");
        const data = await response.json();
        setSpareParts(data.data);
      } catch (error) {
        console.error(
          "Erreur lors du chargement des pièces de rechange :",
          error
        );
      }
    };

    fetchSpareParts();
  }, []);

  const handleSubmit = (
    values: z.infer<typeof MaintenanceSparePartformSchema>
  ) => {
    console.log(values);
    onSubmit(values);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="">
          <DialogHeader>
            <DialogTitle>Pièce utilisée lors de la maintenance</DialogTitle>
            <DialogDescription>
              Vous pouvez consulter et modifier les pièces utilisées lors de la
              maintenance du :{" "}
              {new Date(maintenance.maintenanceDate).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>

          <Label>Description</Label>
          <Textarea
            defaultValue={maintenance.description}
            readOnly
            disabled
            className="w-full"
          />

          <Label>Recommandation du technicien</Label>
          <Textarea
            defaultValue={maintenance.techniciansRecommendation}
            readOnly
            disabled
            className="w-full"
          />

          <Label>Pièces remplacées</Label>

          <div className="flex flex-col gap-y-4 mb-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-x-2">
                {/* Select pour choisir la pièce */}
                <Controller
                  control={form.control}
                  name={`replacedParts.${index}.sparePartId`}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selectionner un type de maintenance" />
                      </SelectTrigger>
                      <SelectContent>
                        {spareParts.map((sparePart) => (
                          <SelectItem key={sparePart.id} value={sparePart.id}>
                            {sparePart.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />

                {/* Input pour la quantité */}
                <Controller
                  control={form.control}
                  name={`replacedParts.${index}.quantity`}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      placeholder="Quantité"
                      className="w-1/4"
                    />
                  )}
                />

                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => remove(index)}
                >
                  Supprimer
                </Button>
              </div>
            ))}
          </div>

          <DialogFooter className="sm:justify-start">
            <Button type="submit">Modifier</Button>
            <Button
              type="button"
              onClick={() =>
                append({
                  sparePartId: "",
                  quantity: 1,
                  id: "",
                  maintenanceId: maintenance.id,
                })
              }
            >
              Ajouter une ligne de pièce
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

export default SparePartOnMaintenance;
