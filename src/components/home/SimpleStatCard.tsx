import { Card } from '../ui/card';
import { CardContent } from '@/components/ui/card';

interface StatCardProps {
  label: string;
  value: string | number;
  variation?: string;
  variationColor: string;
}

export const SimpleStatCard = ({
  label,
  value,
  variation,
  variationColor,
}: StatCardProps) => (
  <Card>
    <CardContent className="py-1 px-6 space-y-2">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="text-2xl font-semibold">{value}</div>
      {variation && (
        <div className={`text-sm ${variationColor}`}>{variation}</div>
      )}
    </CardContent>
  </Card>
);
