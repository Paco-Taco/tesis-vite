import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Settings, LogOut } from 'lucide-react'; // ✅ NEW
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Input } from '../ui/input';
import { Tarifa, useTarifaStore } from '@/store/useTarifaStore';
import { useAuth } from '@/context/authContext';

export const SettingsDialog = () => {
  const { setCurrentTarifa, currentTarifa } = useTarifaStore();
  const { user, signOut, loading } = useAuth(); // ✅ NEW

  const tariffs = [
    { label: 'Doméstica Zona Rural', value: 'R' },
    { label: 'Doméstica A', value: 'DA' },
    { label: 'Doméstica B', value: 'DB' },
    { label: 'Condominial', value: 'C' },
    { label: 'Comercial A', value: 'CA' },
    { label: 'Comercial B', value: 'CB' },
    { label: 'Industrial', value: 'I' },
  ];

  const userInfo = [
    {
      label: 'Nombre de usuario',
      value: user?.username ?? '',
    },
    {
      label: 'Correo electrónico',
      value: user?.correo_institucional ?? '',
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
          <DialogDescription>Tarifa actual: {currentTarifa}</DialogDescription>

          <div className="relative">
            <div className="flex gap-2 overflow-x-auto no-scrollbar rounded-md">
              {tariffs.map((item) => (
                <Button
                  key={item.value}
                  className={`border text-gray-800 dark:text-gray-100 bg-white dark:bg-neutral-800 hover:bg-green-100 hover:text-neutral-800
                    ${
                      currentTarifa === item.value
                        ? 'border-green-500 bg-green-100 font-bold'
                        : 'border-neutral-400'
                    }`}
                  onClick={() => setCurrentTarifa(item.value as Tarifa)}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Avatar (optional)
          <div className="flex gap-4 items-center">
            <Avatar className="w-12 h-12">
              <AvatarImage
                src={user?.imageUrl ?? 'https://github.com/shadcn.png'}
              />
              <AvatarFallback>UC</AvatarFallback>
            </Avatar>
          </div>
          */}

          <div className="flex flex-col">
            {userInfo.map(({ label, value }) => (
              <div className="mb-8" key={label}>
                <DialogDescription>{label}</DialogDescription>
                <Input type="text" className="h-12" disabled value={value} />
              </div>
            ))}
          </div>
        </div>

        <DialogFooter
          className="flex w-full"
          style={{ justifyContent: 'space-between' }}
        >
          {/* ✅ Logout button */}
          <Button
            variant="destructive"
            onClick={async () => {
              await signOut();
            }}
            disabled={loading}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </Button>

          <DialogClose asChild>
            <Button variant="secondary">Aceptar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
