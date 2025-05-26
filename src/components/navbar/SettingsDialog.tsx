import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Settings } from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Input } from '../ui/input';

export const SettingsDialog = () => {
  const tariffs = [
    {
      label: 'Doméstica Zona Rural',
      value: 'DZR',
    },
    {
      label: 'Doméstica A',
      value: 'DA',
    },
    {
      label: 'Doméstica B',
      value: 'DB',
    },
    {
      label: 'Condominial',
      value: 'CO',
    },
    {
      label: 'Comercial A',
      value: 'CA',
    },
    {
      label: 'Comercial B',
      value: 'CB',
    },
    {
      label: 'Industrial',
      value: 'IN',
    },
  ];

  return (
    <Dialog>
      <DialogTrigger>
        <div className="hover:bg-gray-100 hover:dark:bg-neutral-900 rounded-3xl p-2">
          <Settings />
        </div>
      </DialogTrigger>
      <DialogContent className="min-w-[80%]">
        <div className="grid grid-cols-1 items-center gap-5">
          <DialogTitle>Ajustes</DialogTitle>
          <DialogDescription>Tarifa</DialogDescription>
          <div className="relative">
            <div className="flex gap-2 overflow-x-auto no-scrollbar rounded-md">
              {tariffs.map((item) => (
                <Button
                  className="bg-transparent border border-neutral-400 text-gray-800 dark:text-gray-100 dark:bg-neutral-800 hover:bg-green-100 hover:text-neutral-800"
                  key={item.value}
                  value={item.value}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex gap-4 items-center">
            <Avatar className="w-12 h-12">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>UC</AvatarFallback>
            </Avatar>
            <span className="underline cursor-pointer">Editar Avatar</span>
          </div>
          <div className="flex flex-col gap-2">
            <DialogDescription>Email</DialogDescription>
            <Input
              type="email"
              placeholder="Email"
              className="h-12"
              disabled={true}
              value="frodriguez25@ucol.mx"
            />
          </div>
        </div>

        <DialogFooter>
          <Button>Guardar Cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
