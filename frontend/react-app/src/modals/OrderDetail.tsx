import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { Order } from "@/types/Order";
import { SparePart } from "@/types/SparePart";
import { useEffect, useState } from "react";

interface Props {
  order: Order;
}

const OrderDetail = (props: Props) => {
  const [spareParts, setSpareParts] = useState<SparePart[]>([]);

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

  useEffect(() => {
    fetchSpareParts();
  }, []);

  return (
    <>
      <DialogHeader>
        <DialogTitle>Detail de la Commande</DialogTitle>
        <DialogDescription>
          Concernant la commande du{" "}
          {new Date(props.order.orderDate).toLocaleDateString()}
        </DialogDescription>
      </DialogHeader>
      <div className="grid grid-cols-5 gap-4 px-2">
        <p className="col-span-4">Montant Total:</p>
        <p className="col-span-1 text-right">{props.order.totalAmount}€</p>
      </div>

      <hr className="w-full border border-primary"></hr>

      <div className="grid grid-cols-5 gap-4 px-2">
        {props.order.orderLines.map((orderLine, index) => (
          <>
            <p className="">Ligne: {index + 1}</p>

            <p className="col-span-2">
              {spareParts.find((sp) => sp.id === orderLine.sparePartId)?.name}
            </p>
            <p className="col-span-1">x {orderLine.quantity}</p>

            <p className="col-span-1 text-right">{orderLine.unitPrice}€</p>
          </>
        ))}
      </div>

      <DialogFooter className="sm:justify-start">
        <DialogClose asChild>
          <Button type="button" variant="secondary">
            Fermer
          </Button>
        </DialogClose>
      </DialogFooter>
    </>
  );
};

export default OrderDetail;
