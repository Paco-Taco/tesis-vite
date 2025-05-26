import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const data = [
  { name: 'Feb', linea1: 4, linea2: 3.5, linea3: 2.8, barra: 2 },
  { name: 'Mar', linea1: 5.5, linea2: 4.8, linea3: 3.1, barra: 2.5 },
  { name: 'Apr', linea1: 6.7, linea2: 3.9, linea3: 4.2, barra: 3.2 },
  { name: 'Jun', linea1: 5.1, linea2: 6.0, linea3: 3.9, barra: 3.5 },
  { name: 'Jul', linea1: 5.9, linea2: 5.3, linea3: 4.8, barra: 3.8 },
  { name: 'Aug', linea1: 4.7, linea2: 4.6, linea3: 4.1, barra: 3.2 },
  { name: 'Oct', linea1: 3.9, linea2: 3.7, linea3: 2.9, barra: 2.7 },
];

export const ConsumoScreen = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start gap-4">
        <div className="flex items-start gap-2 bg-muted p-4 rounded-lg max-w-md">
          <Info className="mt-1 w-5 h-5" />
          <p>
            El <span className="font-semibold">consumo diario</span> se
            actualiza cada 24 horas. Si el consumo medio en una semana es mayor
            a <span className="font-semibold">7 m³/día</span>, es necesario
            aplicar estrategias adecuadas para ahorrar energía.
          </p>
        </div>
        <div className="flex items-start gap-2 bg-muted p-4 rounded-lg max-w-md">
          <Info className="mt-1 w-5 h-5" />
          <p>
            El <span className="font-semibold">consumo bimestral</span> se
            actualiza cada 60 días. Si el consumo en tres periodos es superior a{' '}
            <span className="font-semibold">25 m³/periodo</span>, el usuario
            recibirá una multa o la sanción correspondiente a principios del año
            siguiente.
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">&nbsp;</div>
        <Button variant="outline" size="sm">
          Imprimir Factura
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold">Consumo Por Día</h3>
            <p className="text-sm text-muted-foreground">(+43%) que ayer</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="barra" fill="#22c55e" />
                <Line
                  type="monotone"
                  dataKey="linea1"
                  stroke="#facc15"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="linea2"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="linea3"
                  stroke="#fb923c"
                  strokeWidth={2}
                  dot={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold">Consumo Por Bimestre</h3>
            <p className="text-sm text-muted-foreground">
              (+43%) que el bimestre pasado
            </p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="barra" fill="#22c55e" />
                <Line
                  type="monotone"
                  dataKey="linea1"
                  stroke="#facc15"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="linea2"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="linea3"
                  stroke="#fb923c"
                  strokeWidth={2}
                  dot={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
