<script setup lang="ts">
import { Button } from '@/components/ui/button'
import './assets/index.css'

import { useForm, useFieldArray } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'

const formSchema = toTypedSchema(z.object({
  orders: z.array(z.object({
    piece: z.string().min(2, "Sélectionnez une pièce").max(50),
    quantity: z.coerce.number().int().positive("Doit être un nombre positif"),
  })).min(1, "Ajoutez au moins une commande"),
}))

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    orders: [{ piece: '', quantity: 1 }] // Une ligne de commande par défaut
  }
})

const { remove, push, update } = useFieldArray('orders')


const onSubmit = form.handleSubmit((values) => {
  console.log('Form submitted!', values)
})

const addOrder = () => {
  push({ piece: '', quantity: 1 })
}

const removeOrder = (index: number) => {
  remove(index)
}

</script>

<template>
  <div class="h-screen flex items-center justify-center">
    <Card>
      <form @submit.prevent="onSubmit">
      <CardHeader>
        <CardTitle>Commander des Piece</CardTitle>
        <CardDescription>Remplir les champs afin de commander de nouvelle pièce</CardDescription>
      </CardHeader>
      <CardContent>
          <div class="flex flex-col gap-y-4">
            <div v-for="(field, index) in form.values.orders" :key="field.key" class="flex items-center gap-x-2">
              <FormField v-slot="{ componentField }" :name="`orders.${index}.piece`">
                <FormItem class="w-3/5">
                  <FormLabel>Pièce</FormLabel>
                  <Select v-bind="componentField">
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une pièce" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="roue">roue</SelectItem>
                        <SelectItem value="moteur">moteur</SelectItem>
                        <SelectItem value="pot d'échappement">pot d'échappement</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              </FormField>
              
              <FormField v-slot="{ componentField }" :name="`orders.${index}.quantity`">
                <FormItem class="w-1/5">
                  <FormLabel>Quantité</FormLabel>
                  <Input v-bind="componentField" type="number" min="1" />
                  <FormMessage />
                </FormItem>
              </FormField>

              <!-- Bouton pour supprimer une ligne -->
              <Button type="button" variant="destructive" class="self-end mb-0.5" @click="removeOrder(index)" size="icon">
                ✖
              </Button>
            </div>
          </div>

          <!-- Bouton pour ajouter une ligne -->
          <Button type="button" variant="secondary" class="mt-4 w-full" @click="addOrder">
            Ajouter une ligne
          </Button>
        </CardContent>
      <CardFooter>
        <Button type="submit">
          Commander
        </Button>
      </CardFooter>
      </form>
    </Card>
  </div>
</template>