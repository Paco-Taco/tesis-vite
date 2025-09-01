import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { GastoActual } from '@/components/home/GastoActual';
import { SimpleStatCard } from '@/components/home/SimpleStatCard';
import { ConsumoDiario } from '@/types/consumoTypes';
import { ScreenTitle } from '../components/shared/ScreenTitle';
import { useAuth } from '@/context/authContext';
import { RangeIndicator } from '@/components/home/RangeIndicator';
import { useTarifaStore } from '@/store/useTarifaStore';

export const MainDashboard = () => {
  const { user } = useAuth();

  const [consumoDelDia, setConsumoDelDia] = useState<ConsumoDiario | null>(
    null
  );
  const [horaActualizacion, setHoraActualizacion] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const { currentTarifa } = useTarifaStore();

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
      const partes = data.timestamp.split(', ');
      const horaFormateada = partes[1] || 'Hora inválida';
      setConsumoDelDia(data);
      setHoraActualizacion(horaFormateada);
      setLoading(false);
    });

    return () => {
      socket.disconnect();
      console.log('🔌 Desconectado del WebSocket');
    };
  }, []);

  const statCardsData = [
    {
      label: 'Agua consumida hoy',
      value: consumoDelDia ? `${consumoDelDia.lectura} m³` : 'Cargando...',
      variation: '+2.6%',
      variationColor: 'text-green-500',
    },
    {
      label: 'Agua consumida esta semana',
      value: consumoDelDia
        ? `${(consumoDelDia.lectura ?? 0) + 4123} m³`
        : 'Cargando...',
      variation: '+0.2%',
      variationColor: 'text-green-500',
    },
    {
      label: 'Agua consumida este mes',
      value: consumoDelDia
        ? `${(consumoDelDia.lectura ?? 0) + 10123} m³`
        : 'Cargando...',
      variation: '-0.1%',
      variationColor: 'text-red-500',
    },
  ];

  if (loading || !consumoDelDia) {
    return (
      <div className="flex justify-center items-center h-[80%]">
        <div className="flex-1 justify-items-center text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-black dark:border-white mb-6"></div>
          <span>Cargando Datos en Tiempo Real...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ScreenTitle label={`Bienvenido, ${user?.username ?? 'Usuario'} 👋`} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCardsData.map((item, index) => (
          <SimpleStatCard
            key={index}
            label={item.label}
            value={item.value}
            variation={item.variation}
            variationColor={item.variationColor}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        <div className="md:col-span-1">
          <GastoActual consumoDelDia={consumoDelDia} />
        </div>
        <div className="md:col-span-2">
          <RangeIndicator
            consumo={consumoDelDia.lectura ?? 0}
            tarifaCode={currentTarifa}
          />
        </div>

        <div>
          <span className="text-muted-foreground text-sm ">
            Última actualización: {horaActualizacion}
          </span>
        </div>
      </div>
    </div>
  );
};
