import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ChartCardProps {
  title: string;
  children: ReactNode;
}

export const ChartCard = ({ title, children }: ChartCardProps) => (
  <Card>
    <CardHeader className="flex flex-row justify-between items-center">
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent className="pt-2">{children}</CardContent>
  </Card>
);
