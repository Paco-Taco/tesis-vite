import Plot from 'react-plotly.js';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { GastoActual } from '@/components/home/GastoActual';
import { SimpleStatCard } from '@/components/home/SimpleStatCard';
import { ConsumoDiario } from '@/types/consumoTypes';
import { ChartCard } from '@/components/shared/ChartCard';
import { useAccessibility } from '@/context/accessibilityContext';
import { ScreenTitle } from '../components/shared/ScreenTitle';

export const MainDashboard = () => {
  const { isDark } = useAccessibility();

  const [consumoDelDia, setConsumoDelDia] = useState<ConsumoDiario | null>(
    null
  );
  const [horaActualizacion, setHoraActualizacion] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  // Inicializar datos de la gráfica desde localStorage
  const initialData = () => {
    const cached = localStorage.getItem('dataGraph');
    return cached ? JSON.parse(cached) : { x: [], y: [] };
  };

  const [dataGraph, setDataGraph] = useState<{ x: string[]; y: number[] }>(
    initialData
  );

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

      // Agregar nuevo punto y mantener solo los últimos 5
      setDataGraph((prev) => {
        const updated = {
          x: [...prev.x, horaFormateada].slice(-5),
          y: [...prev.y, data.lectura].slice(-5),
        };
        localStorage.setItem('dataGraph', JSON.stringify(updated));
        return updated;
      });
    });

    return () => {
      socket.disconnect();
      console.log('🔌 Desconectado del WebSocket');
    };
  }, []);

  const [isDarkMode, setIsDarkMode] = useState(isDark);

  useEffect(() => {
    setIsDarkMode(isDark);
    console.log(isDark);
  }, [isDark]);

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
        <div className="flex-1 block justify-items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-black dark:border-white mb-6"></div>
          <span>Cargando Datos en Tiempo Real...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ScreenTitle label="Bienvenido, Francisco 👋" />

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <GastoActual consumoDelDia={consumoDelDia} />
        </div>
        <div className="md:col-span-2">
          {dataGraph.x.length > 0 ? (
            <ChartCard title="Tarifa">
              <Plot
                data={[
                  {
                    x: dataGraph.x,
                    y: dataGraph.y,
                    type: 'scatter',
                    mode: 'lines+markers',
                    marker: { color: '#193cb8' },
                    name: 'Consumo',
                  },
                ]}
                layout={{
                  title: 'Consumo de Agua en Tiempo Real (últimos 5)',
                  xaxis: { title: 'Hora', color: isDarkMode ? '#fff' : '#000' },
                  yaxis: {
                    title: 'Lectura (m³)',
                    color: isDarkMode ? '#fff' : '#000',
                  },
                  autosize: true,
                  paper_bgcolor: isDarkMode ? '#171717' : '#fff',
                  plot_bgcolor: isDarkMode ? '#171717' : '#fff',
                  font: { color: isDarkMode ? '#fff' : '#000' },
                }}
                style={{ width: '100%', height: '100%' }}
              />
            </ChartCard>
          ) : (
            <div className="flex justify-center items-center h-full">
              <span>Cargando gráfica...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
