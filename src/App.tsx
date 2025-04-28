import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Progress } from './components/ui/progress';
import Layout from './layout';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

function App() {
  return (
    <Layout>
      <h1 className="text-2xl font-bold">
        Bienvenido <span className="font-semibold">Francisco 👋</span>
      </h1>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Agua consumida hoy</p>
            <div className="text-2xl font-bold">18,765 m³</div>
            <div className="text-green-500 text-sm">+2.6%</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              Agua consumida esta semana
            </p>
            <div className="text-2xl font-bold">4,876 m³</div>
            <div className="text-green-500 text-sm">+0.2%</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              Agua consumida este mes
            </p>
            <div className="text-2xl font-bold">678 m³</div>
            <div className="text-red-500 text-sm">-0.1%</div>
          </CardContent>
        </Card>
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Gasto Actual</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="relative">
              <Progress value={70} className="w-40 h-40 rounded-full" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">$256.54</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Tarifa</CardTitle>
            <select className="border rounded px-2 py-1 text-sm">
              <option>Doméstico A</option>
            </select>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={[
                  { name: 'B', value: 120 },
                  { name: 'IL', value: 115 },
                  { name: 'IM', value: 115 },
                  { name: 'IH', value: 110 },
                  { name: 'H', value: 105 },
                  { name: 'S', value: 95 },
                ]}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Bar dataKey="value" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

export default App;
