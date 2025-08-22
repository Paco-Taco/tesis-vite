import { GastoAproximado } from '@/components/forecast/GastoAproximado';
import { TarifaFuturaChart } from '@/components/forecast/TarifaFuturaChart';
import { StatCard } from '@/components/home/StatCard';
import { useState } from 'react';

export const PronosticoScreen = () => {
  const [statCardsData, setStatCardsData] = useState([
    {
      label: 'Agua consumida mañana',
      value: '11,765 m³',
      variation: '+2.6%',
      variationColor: 'text-green-500',
    },
    {
      label: 'Agua consumida la próxima semana',
      value: '1,876 m³',
      variation: '+0.2%',
      variationColor: 'text-green-500',
    },
    {
      label: 'Agua consumida el próximo mes',
      value: '678 m³',
      variation: '-0.1%',
      variationColor: 'text-red-500',
    },
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-regular">
        Bienvenido,{' '}
        <span className="font-semibold text-primary">Francisco 👋</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCardsData.map((item, index) => (
          <StatCard
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
          <GastoAproximado />
        </div>
        <div className="md:col-span-2">
          <TarifaFuturaChart />
        </div>
      </div>
    </div>
  );
};
