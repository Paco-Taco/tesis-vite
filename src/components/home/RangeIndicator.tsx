import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  getCaps,
  getCurrentRange,
  RANGE_NAMES,
  TarifaCode,
} from '@/utils/tarifas';
import { Separator } from '@/components/ui/separator';
import { Info, Lightbulb, TriangleAlert } from 'lucide-react';

const SEG_COLORS = [
  '#60D394',
  '#82a546',
  '#F7CB73',
  '#F18F01',
  '#F66B0E',
  '#D7263D',
];

interface RangeIndicatorProps {
  consumo: number;
  tarifaCode: TarifaCode;
  className?: string;
}

export const RangeIndicator: React.FC<RangeIndicatorProps> = ({
  consumo,
  tarifaCode,
  className,
}) => {
  const { caps, totalCap } = getCaps(tarifaCode);
  const { index, name, toNext } = getCurrentRange(consumo, tarifaCode);

  const pct = totalCap > 0 ? Math.min(consumo / totalCap, 1) : 0;
  const pointerLeft = `${Math.min(consumo / Math.max(totalCap, 1), 1) * 100}%`;

  const widths = caps.map((c) =>
    totalCap ? `${(c / totalCap) * 100}%` : '0%'
  );

  /* ===== choose a single tip (by priority) ===== */
  const nextName = RANGE_NAMES[index + 1];
  const currentCap = caps[index] ?? 0;
  const nearJumpThreshold = Math.max(1, 0.1 * currentCap); // “close” = 10% of block or at least 1 m³
  const nearTotalThreshold = 0.1 * totalCap; // “close” to overall cap = last 10%
  const remainingTotal = Math.max(0, totalCap - consumo);

  type Tip = { icon: 'info' | 'bulb' | 'warn'; text: string };
  let tip: Tip;

  if (index === 5) {
    tip = {
      icon: 'warn',
      text: 'Estás en excedente. Reduce consumos no críticos para evitar cargos elevados.',
    };
  } else if (remainingTotal <= nearTotalThreshold) {
    tip = {
      icon: 'warn',
      text: `Muy cerca del límite del periodo: quedan ${remainingTotal.toFixed(
        2
      )} m³ del tope.`,
    };
  } else if (toNext > 0 && toNext <= nearJumpThreshold && nextName) {
    tip = {
      icon: 'info',
      text: `Te faltan ${toNext.toFixed(
        2
      )} m³ para pasar a “${nextName}”. Considera posponer usos intensivos.`,
    };
  } else if (index === 0 && pct < 0.3) {
    tip = {
      icon: 'bulb',
      text: 'Buen ritmo: mantén hábitos eficientes para permanecer en el rango Básico.',
    };
  } else {
    tip = {
      icon: 'bulb',
      text: 'Revisa fugas y planifica usos intensivos para mantenerte en tu rango actual.',
    };
  }

  const renderIcon = (k: 'info' | 'bulb' | 'warn') =>
    k === 'bulb' ? (
      <Lightbulb className="h-4 w-4" />
    ) : k === 'warn' ? (
      <TriangleAlert className="h-4 w-4" />
    ) : (
      <Info className="h-4 w-4" />
    );

  return (
    <Card className={cn('w-full', className)}>
      <CardContent className="pt-4 space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Tarifa actual</p>
          <Badge
            variant={index === 5 ? 'destructive' : 'secondary'}
            className="font-medium"
          >
            Rango actual: {name}
          </Badge>
        </div>

        {/* Range bar */}
        <div className="relative w-full">
          <div className="flex h-3 w-full rounded-full overflow-hidden ring-1 ring-border">
            {widths.map((w, i) => (
              <div
                key={i}
                style={{ width: w, backgroundColor: SEG_COLORS[i] }}
                className="h-full"
              />
            ))}
          </div>

          <div className="pointer-events-none absolute inset-0 flex overflow-hidden rounded-full">
            {widths.map((w, i) => {
              const segStart = widths
                .slice(0, i)
                .reduce((acc, s) => acc + parseFloat(s), 0);
              const filledPct = Math.max(
                0,
                Math.min(100 * pct - segStart, parseFloat(w))
              );
              return (
                <div key={i} className="relative h-3" style={{ width: w }}>
                  <div
                    className="h-full"
                    style={{
                      width: `${Math.max(0, filledPct)}%`,
                      backgroundColor: SEG_COLORS[i],
                    }}
                  />
                </div>
              );
            })}
          </div>

          <div
            className="absolute -top-1 h-5 w-0.5 bg-foreground rounded-full"
            style={{ left: pointerLeft }}
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{consumo.toFixed(2)} m³</span>
          <span className="text-muted-foreground">
            Límite: {totalCap.toFixed(0)} m³
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 text-sm">
          <span
            className="inline-block h-3 w-3 rounded-sm"
            style={{ backgroundColor: SEG_COLORS[index] }}
          />
          <span className={cn(index === 5 && 'text-destructive')}>
            {index === 5
              ? 'Consumo por encima del límite (excedente)'
              : 'Consumo dentro del rango'}
          </span>
        </div>

        {/* --- Extra "spacey" info section --- */}
        <div className="mt-6 space-y-2 text-sm">
          <p className="text-muted-foreground">
            <strong>Rango actual:</strong> {name}
          </p>
          <p className="text-muted-foreground">
            <strong>Faltante para el siguiente rango:</strong>{' '}
            {index < 5 ? `${toNext.toFixed(2)} m³` : 'N/A'}
          </p>
          <p className="text-muted-foreground">
            Mantén tu consumo dentro del rango para evitar cargos adicionales.
          </p>
        </div>

        {/* footer tip pinned to bottom */}
        <div>
          <Separator className="mb-5" />
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <span
              className={cn(
                'mt-0.5',
                tip.icon === 'warn' && 'text-destructive',
                tip.icon === 'bulb' && 'text-yellow-600 dark:text-yellow-500'
              )}
            >
              {renderIcon(tip.icon)}
            </span>
            <p className="leading-snug">{tip.text}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
