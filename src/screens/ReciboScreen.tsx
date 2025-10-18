import layout from '@/assets/img/recibo-vacio.jpeg';
import { RangeIndicator } from '@/components/home/RangeIndicator';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useTarifaStore } from '@/store/useTarifaStore';
import { ConsumoDiario } from '@/types/consumoTypes';
import { calcularTotalAPagar } from '@/utils/CalcularTotalAPagar';
import { precios, tarifas } from '@/utils/tarifas';
import { ChevronLeft, Printer } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';

export const ReciboScreen = () => {
  const { currentTarifa } = useTarifaStore();
  const [consumoDelDia, setConsumoDelDia] = useState<ConsumoDiario | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const socket = io('https://api-tesis-7k22.onrender.com', {
      transports: ['websocket'],
      path: '/socket.io',
    });

    socket.on('connect', () => {
      console.log('🔌 Conectado al WebSocket');
    });

    socket.on('datos', (data: ConsumoDiario) => {
      console.log('📥 Datos recibidos:', data);
      // const partes = data.timestamp.split(', ');
      // const horaFormateada = partes[1] || 'Hora inválida';
      setConsumoDelDia(data);
      // setHoraActualizacion(horaFormateada);
      setLoading(false);
    });
  }, []);

  const gastoAcumulado = calcularTotalAPagar(
    consumoDelDia?.lectura ?? 0,
    currentTarifa, // recuerda mandar tarifa dinamicamente
    tarifas,
    precios
  );

  if (loading)
    return (
      <div className="flex-1 flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );

  return (
    <>
      <div className="flex flex-row w-full justify-between">
        <Link to="/consumo">
          <Button variant="outline">
            <ChevronLeft />
            Regresar
          </Button>
        </Link>

        <Button onClick={() => window.print()}>
          <Printer />
          Imprimir
        </Button>
      </div>
      <div className="relative flex justify-center items-center h-screen">
        <div className="relative">
          <img
            src={layout}
            alt="recibo"
            className="max-w-full h-auto rounded-2xl shadow-lg"
          />

          {/* Overlay content */}
          <div className="absolute inset-0 grid grid-cols-5 grid-rows-4">
            <div className="flex col-start-2 row-start-1 items-center justify-start pl-5 pt-10">
              <p className="text-black text-sm font-bold">{gastoAcumulado}</p>
            </div>
            <div className="flex col-start-1 row-start-2 col-span-5 row-span-2 pt-10 px-2 mt-6">
              <RangeIndicator
                consumo={consumoDelDia?.lectura ?? 0}
                tarifaCode={currentTarifa}
                className="bg-neutral-50 text-black h-[180px]"
                noExtraInfo
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
