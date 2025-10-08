import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogTitle,
} from '@radix-ui/react-dialog';
import React from 'react';
import { DialogContent, DialogFooter, DialogHeader } from '../ui/dialog';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';

interface Props {
  open: boolean;
}

export const VerificationPendingDialog: React.FC<Props> = ({ open }) => {
  return (
    <Dialog open={open}>
      <DialogContent className="[&>button:last-child]:hidden">
        <DialogHeader>
          <DialogTitle className="font-bold text-xl">
            Estás muy cerca 😁
          </DialogTitle>
          <DialogDescription>
            Revisa la bandeja de entrada del correo electrónico proporcionado y
            verifica tu cuenta. Así podrás acceder al dashboard.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Link to="/login">
              <Button variant="outline">Entendido</Button>
            </Link>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
