import { Card, CardContent } from '../ui/card';

interface Props {
  title: string | React.ReactNode;
  main: React.ReactNode;
  sub?: React.ReactNode;
}

export const StatCard: React.FC<Props> = ({ title, main, sub }) => {
  return (
    <Card>
      <CardContent className="py-2">
        <div className="text-xs text-muted-foreground">{title}</div>
        <div className="text-2xl font-semibold">{main}</div>
        {sub ? <p className="text-xs mt-1">{sub}</p> : null}
      </CardContent>
    </Card>
  );
};
