import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
} from 'recharts';

interface Props {
  data: {
    days: {
      day: string;
      fecha: string;
      totalDia: number;
      MA7: number | null;
      pico: number;
      horaPico: string;
    }[];
    consumoTotal: number;
  };
  config: ChartConfig;
}

export const MonthlyConsumptionChart: React.FC<Props> = ({ data, config }) => {
  return (
    <ChartContainer config={config} className="aspect-auto h-[250px] w-full">
      <ComposedChart
        data={data.days}
        accessibilityLayer
        margin={{ top: 20, right: 24, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="day"
          tickMargin={10}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis tick={{ fontSize: 12 }} />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent labelFormatter={(label) => `Día ${label}`} />
          }
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="totalDia"
          fill="var(--consumo)"
          stackId="a"
          radius={[4, 4, 0, 0]}
        />
        {/* <Bar
                    dataKey="pico"
                    stackId="a"
                    fill="var(--chart-2)"
                    radius={[0, 0, 4, 4]}
                  /> */}

        <Line
          dataKey={'MA7'}
          type="monotone"
          stroke={`var(--chart-3)`}
          strokeWidth={2}
        />
      </ComposedChart>
    </ChartContainer>
  );
};
