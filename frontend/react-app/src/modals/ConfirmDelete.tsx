import React from "react";

import {
  DialogFooter,
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

interface Props {
  title: string;
  description: string;
  confirmAction: () => void;
  cancelAction: () => void;
}

const ConfirmDelete = (props: Props) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle>{props.title}</DialogTitle>
        <DialogDescription>{props.description}</DialogDescription>
      </DialogHeader>

      <DialogFooter className="sm:justify-start">
        <Button
          type="button"
          variant="destructive"
          onClick={props.confirmAction}
        >
          Confirmer
        </Button>
        <DialogClose asChild>
          <Button
            type="button"
            variant="secondary"
            onClick={props.cancelAction}
          >
            Fermer
          </Button>
        </DialogClose>
      </DialogFooter>
    </>
  );
};

export default ConfirmDelete;
