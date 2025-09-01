import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { ChartCard } from '../shared/ChartCard';

const data = [
  { name: 'B', barValue: 60, areaValue: 80 },
  { name: 'IL', barValue: 85, areaValue: 95 },
  { name: 'IM', barValue: 115, areaValue: 140 },
  { name: 'IH', barValue: 110, areaValue: 155 },
  { name: 'H', barValue: 45, areaValue: 120 },
  { name: 'S', barValue: 95, areaValue: 100 },
];

const colors = [
  '#16796C',
  '#2DBE60',
  '#A0DC52',
  '#FFE640',
  '#FCB643',
  '#FA5654',
];

export const TarifaFuturaChart = () => (
  <ChartCard title="Tarifa">
    <ResponsiveContainer width="100%" height={350}>
      <ComposedChart data={data}>
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="areaValue"
          fill="#b8dbe9"
          stroke="#0f5d67"
          strokeWidth={2}
          fillOpacity={0.3}
        />
        <Bar dataKey="barValue" barSize={70} radius={[4, 4, 0, 0]}>
          {/* @ts-ignore */}
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index]} />
          ))}
        </Bar>
        {/* <Line
          type="monotone"
          dataKey="lineValue"
          stroke="#00796B"
          strokeWidth={2}
          dot={{ r: 4 }}
        /> */}
      </ComposedChart>
    </ResponsiveContainer>
  </ChartCard>
);
