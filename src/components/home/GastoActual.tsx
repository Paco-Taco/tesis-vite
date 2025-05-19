import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const GastoActual = () => (
  <Card className="flex flex-col h-full">
    <CardHeader>
      <CardTitle>Gasto Actual</CardTitle>
    </CardHeader>
    <CardContent className="flex flex-grow justify-center items-center py-6">
      <div className="flex flex-col w-70 h-70 border-[14px] p-2 border-green-600 rounded-full items-center justify-center">
        <span className="text-lg font-regular text-gray-500">Total</span>
        <span className="text-2xl font-bold text-primary">$256.54</span>
      </div>
    </CardContent>
  </Card>
);
