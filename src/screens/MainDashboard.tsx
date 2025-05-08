import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useState } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

export const MainDashboard = () => {
  const [statCardsData, setStatCardsData] = useState([
    {
      label: 'Agua consumida hoy',
      value: '18,765 m³',
      change: '+2.6%',
      changeColor: 'text-green-500',
    },
    {
      label: 'Agua consumida esta semana',
      value: '4,876 m³',
      change: '+0.2%',
      changeColor: 'text-green-500',
    },
    {
      label: 'Agua consumida este mes',
      value: '678 m³',
      change: '-0.1%',
      changeColor: 'text-red-500',
    },
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-regular">
        Bienvenido,{' '}
        <span className="font-semibold text-primary">Francisco 👋</span>
      </h1>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCardsData.map((item, index) => (
          <Card key={index}>
            <CardContent className=" py-1 px-6 space-y-2">
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <div className="text-2xl font-semibold">{item.value}</div>
              <div className={`text-sm ${item.changeColor}`}>{item.change}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Gasto Actual */}
        <div className="md:col-span-1">
          <Card className="flex flex-col h-full">
            <CardHeader>
              <CardTitle>Gasto Actual</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-grow justify-center items-center py-6">
              <div className="relative w-40 h-40">
                <Progress value={70} className="w-full h-full rounded-full" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">
                    $256.54
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tarifa */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Tarifa</CardTitle>
              <select className="border border-muted rounded-md px-3 py-1 text-sm focus:outline-none">
                <option>Doméstico A</option>
              </select>
            </CardHeader>
            <CardContent className="pt-2">
              <ResponsiveContainer width="100%" height={350}>
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
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
