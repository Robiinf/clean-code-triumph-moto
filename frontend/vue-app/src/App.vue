<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { onMounted, reactive } from 'vue'
import './assets/index.css'
import Toaster from '@/components/ui/toast/Toaster.vue'

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

import { useToast } from '@/components/ui/toast/use-toast'

interface State{
  spareParts: {
    id: number
    name: string
    price: number
  }[]
}

const state = reactive<State>({ spareParts: [] })

const formSchema = toTypedSchema(z.object({
  orderLines: z.array(z.object({
    sparePartId: z.string().min(2, "Sélectionnez une pièce").max(50),
    quantity: z.coerce.number().int().positive("Doit être un nombre positif"),
  })).min(1, "Ajoutez au moins une commande"),
}))

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    orderLines: [{ sparePartId: '', quantity: 1 }] // Une ligne de commande par défaut
  }
})

const { remove, push } = useFieldArray('orderLines')


const onSubmit = form.handleSubmit((values) => {


const { toast } = useToast()
  const response =  fetch('http://localhost:3000/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(values),
  })

  response.then(response => response.json())
    .then(data => {
      if(data.status === "success"){
      toast({
        title: 'Commande effectuée',
      });
      } else {
        toast({
          title: 'Erreur lors de la commande',
          description: data.message,
          variant: 'destructive',
        });
      }
    })
    .catch(error => {
      toast({
        title: 'Erreur lors de la commande',
        description: error.message,
        variant: 'destructive',
      });
    })

})

const addOrder = () => {
  push({ sparePartId: '', quantity: 1 })
}

const removeOrder = (index: number) => {
  remove(index)
}

onMounted(() => {
  //Fetch all the spare parts
  fetch('http://localhost:3000/api/spare-parts')
    .then(response => response.json())
    .then(data => {
      state.spareParts = data.data
    })
    .catch(error => {
      console.error('Error:', error)
    })



})

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
            <div v-for="(field, index) in form.values.orderLines" :key="`orders.${index}.Line`" class="flex items-center gap-x-2">
              <FormField v-slot="{ componentField }" :name="`orderLines.${index}.sparePartId`">
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
                        <SelectItem v-for="sparePart in state.spareParts" :key="sparePart.id" :value="sparePart.id">
                          {{ sparePart.name }}
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              </FormField>
              
              <FormField v-slot="{ componentField }" :name="`orderLines.${index}.quantity`">
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
    <Toaster />
  </div>
</template>