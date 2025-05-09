import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectTrigger } from '@/components/ui/select';
import { SelectContent, SelectItem, SelectValue } from '@radix-ui/react-select';
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

  const selectItems = [
    {
      label: 'Doméstica A',
      value: 'DA',
    },
    {
      label: 'Doméstica B',
      value: 'DB',
    },
    {
      label: 'Empresarial',
      value: 'EM',
    },
  ];

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
              <div className="flex flex-col w-70 h-70 border-[14px] p-2 border-green-600 rounded-full items-center justify-center">
                <span className="text-lg font-regular text-gray-500">
                  Total
                </span>
                <span className="text-2xl font-bold text-primary">$256.54</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tarifa */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Tarifa</CardTitle>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Doméstica A" />
                </SelectTrigger>
                <SelectContent>
                  {selectItems.map((item, index) => (
                    <SelectItem key={index} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
