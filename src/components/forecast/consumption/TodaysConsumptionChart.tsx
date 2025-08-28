import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import React from 'react';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis } from 'recharts';

interface Props {
  data: {
    bars: {
      hour: string;
      consumo: number;
      cumulado: number;
    }[];
    total: number;
  };
  config: ChartConfig;
}

export const TodaysConsumptionChart: React.FC<Props> = ({ data, config }) => {
  return (
    <ChartContainer config={config} className="aspect-auto h-[250px] w-full">
      <AreaChart
        data={data.bars}
        margin={{ top: 20, right: 24, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="fillConsumo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--consumo)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--consumo)" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="fillCumulado" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--cumulado)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--cumulado)" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="hour" tick={{ fontSize: 12 }} interval={2} />
        <YAxis tick={{ fontSize: 12 }} />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              labelFormatter={(label: string) => `Hora: ${label}`}
            />
          }
        />
        <Area
          type="monotone"
          dataKey="consumo"
          fill="url(#fillConsumo)"
          stroke="var(--consumo)"
        />
        <Area
          type="monotone"
          dataKey="cumulado"
          fill="url(#fillCumulado)"
          stroke="var(--cumulado)"
        />
        <ChartLegend content={<ChartLegendContent />} />
      </AreaChart>
    </ChartContainer>
  );
};
