import { Card, CardContent } from '../ui/card';

interface Props {
  title: string;
  main: React.ReactNode;
  sub?: React.ReactNode;
}

export const StatCard: React.FC<Props> = ({ title, main, sub }) => {
  return (
    <Card>
      <CardContent className="py-2">
        <p className="text-xs text-muted-foreground">{title}</p>
        <p className="text-2xl font-semibold">{main}</p>
        {sub ? <p className="text-xs mt-1">{sub}</p> : null}
      </CardContent>
    </Card>
  );
};
