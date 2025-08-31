import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
} from 'recharts';
import { ChartCard } from '../shared/ChartCard';

const data = [
  { name: 'B', value: 120 },
  { name: 'IL', value: 115 },
  { name: 'IM', value: 115 },
  { name: 'IH', value: 110 },
  { name: 'H', value: 105 },
  { name: 'S', value: 95 },
];

const colors = [
  '#16796C',
  '#2DBE60',
  '#A0DC52',
  '#FFE640',
  '#FCB643',
  '#FA5654',
];

export const TarifaChart = () => (
  <ChartCard title="Tarifa">
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Bar dataKey="value" barSize={70} radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </ChartCard>
);
