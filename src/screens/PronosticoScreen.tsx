import { useEffect, useMemo, useState } from 'react';
import { SimpleStatCard } from '@/components/home/SimpleStatCard';
import { PronosticoService } from '@/services/PronosticoService';
import {
  CurrentMonthForecast,
  CurrentYearForecast,
} from '@/infraestructure/interfaces/forecast.interfaces';
import { StatCard } from '@/components/shared/StatCard';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { getMonthStatus } from '@/utils/getMonthStatus';

/** 👇 shadcn + Recharts */
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  ReferenceLine,
} from 'recharts';

/* ====== Helpers ====== */
const fmt = (n?: number) => `${(n ?? 0).toFixed(2)} m³`;
const pct = (x: number) => `${(x * 100).toFixed(1)}%`;

const MONTH_NAMES = [
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic',
];

export const PronosticoScreen = () => {
  const [monthF, setMonthF] = useState<CurrentMonthForecast | null>(null);
  const [yearF, setYearF] = useState<CurrentYearForecast | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [m, y] = await Promise.all([
          PronosticoService.getCurrentMonthForecast(),
          PronosticoService.getCurrentYearForecast(),
        ]);
        if (!mounted) return;
        setMonthF(m as CurrentMonthForecast);
        setYearF(y as CurrentYearForecast);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? 'No se pudo cargar el pronóstico');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  /* ===== Derived KPIs ===== */
  const { monthProgress, yearProgress, monthLabel, yearLabel } = useMemo(() => {
    const monthProgress =
      monthF && monthF.estimadoTotalMes > 0
        ? monthF.consumoActual / monthF.estimadoTotalMes
        : 0;
    const yearProgress =
      yearF && yearF.estimadoTotalAnio > 0
        ? yearF.consumoActual / yearF.estimadoTotalAnio
        : 0;

    const monthLabel = monthF?.mes ?? '';
    const yearLabel = yearF?.anio ? String(yearF.anio) : '';

    return { monthProgress, yearProgress, monthLabel, yearLabel };
  }, [monthF, yearF]);

  const monthStatus = useMemo(() => {
    return getMonthStatus(
      monthProgress,
      monthF?.diasRegistrados ?? 0,
      monthF?.diasRestantes ?? 0
    );
  }, [monthProgress, monthF?.diasRestantes, monthF?.diasRegistrados]);

  /** ====== SERIES PARA GRÁFICAS ======
   * A) Barras por mes (real vs proyectado uniforme en meses restantes)
   * B) Líneas acumuladas (real acumulado vs proyección acumulada hacia la meta anual)
   */
  const {
    cumulativeLines, // [{ mesLabel, realAcum, proyectadoAcum }]
    cumulativeConfig,
    yearTarget,
  } = useMemo(() => {
    if (!yearF) {
      return {
        monthlyBars: [] as Array<{
          mesLabel: string;
          real: number | null;
          proyectado: number | null;
        }>,
        cumulativeLines: [] as Array<{
          mesLabel: string;
          realAcum: number;
          proyectadoAcum: number;
        }>,
        monthlyBarsConfig: {} as ChartConfig,
        cumulativeConfig: {} as ChartConfig,
        yearTarget: 0,
      };
    }

    const realByMonth = new Map<string, number>();
    for (const m of yearF.consumoPorMes ?? []) {
      realByMonth.set(m.mes, m.total); // "06" -> 509.7...
    }

    // Distribución simple del estimado restante: uniforme entre meses restantes
    const target = yearF.estimadoTotalAnio ?? 0;
    const remainingMonths = yearF.mesesRestantes ?? 0;
    const remainingTotal =
      yearF.estimadoRestante ??
      Math.max(target - (yearF.consumoActual ?? 0), 0);
    const perMonthProj =
      remainingMonths > 0 ? remainingTotal / remainingMonths : 0;

    let realAcum = 0;
    let projAcum = 0;
    const lines: Array<{
      mesLabel: string;
      realAcum: number;
      proyectadoAcum: number;
    }> = [];

    for (let i = 0; i < 12; i++) {
      const mm = String(i + 1).padStart(2, '0'); // "01".."12"
      const label = MONTH_NAMES[i];

      const real = realByMonth.get(mm) ?? null;

      // Acumulados:
      if (real !== null) realAcum += real;
      // Para proyección acumulada: suma real hasta donde hay dato + proyección uniforme después
      if (real !== null) {
        projAcum += real;
      } else {
        projAcum += remainingMonths > 0 ? perMonthProj : 0;
      }

      lines.push({ mesLabel: label, realAcum, proyectadoAcum: projAcum });
    }
    const cumulativeConfig: ChartConfig = {
      realAcum: { label: 'Acum. Real', color: 'var(--chart-1)' },
      proyectadoAcum: { label: 'Acum. Proyectado', color: 'var(--chart-3)' },
    };

    return {
      cumulativeLines: lines,
      cumulativeConfig,
      yearTarget: target,
    };
  }, [yearF]);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-regular">Pronóstico</h1>
        <div className="h-24 animate-pulse bg-muted/50 rounded-md" />
        <div className="h-64 animate-pulse bg-muted/50 rounded-md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-regular">Pronóstico</h1>
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-regular">Pronóstico</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Mes: consumo actual vs estimado */}
        <StatCard
          title={
            <span className="inline-flex items-center justify-between gap-2">
              <span>{`Mes en curso (${monthLabel})`}</span>
              <Badge variant="secondary" className={monthStatus.tone}>
                {monthStatus.label}
              </Badge>
            </span>
          }
          main={
            <>
              <div className="text-2xl font-semibold">
                {fmt(monthF?.consumoActual)}
              </div>
              <Progress value={monthProgress * 100} className="mt-2" />
            </>
          }
          sub={`${pct(monthProgress)} del estimado`}
        />

        {/* Año: consumo actual vs estimado */}
        <StatCard
          title={
            <span className="inline-flex items-center justify-between gap-2">
              <span>{`Año (${yearLabel})`}</span>
            </span>
          }
          main={
            <>
              <div className="text-2xl font-semibold">
                {fmt(yearF?.consumoActual)}
              </div>
              <Progress value={yearProgress * 100} className="mt-2" />
            </>
          }
          sub={`${pct(yearProgress)} del estimado`}
        />

        {/* Mes: estimado total + promedio diario */}
        <SimpleStatCard
          label="Estimado total del mes"
          value={fmt(monthF?.estimadoTotalMes)}
          variation={`Prom. diario ${fmt(monthF?.promedioDiario)}`}
          variationColor="text-muted-foreground"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ========= (2) LÍNEAS: ACUMULADO vs META ========= */}
        <div className="rounded-xl col-span-2 border bg-card">
          <div className="px-6 pt-4">
            <h3 className="text-lg font-semibold">
              Trayectoria acumulada anual
            </h3>
            <p className="text-sm text-muted-foreground">
              Comparativo Real vs Proyección acumulada
            </p>
          </div>
          <div className="p-4">
            <ChartContainer
              config={cumulativeConfig}
              className="h-[380px] w-full"
            >
              <LineChart
                data={cumulativeLines}
                accessibilityLayer
                margin={{ top: 12, right: 106, bottom: 8, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="mesLabel" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Line
                  type="monotone"
                  dataKey="realAcum"
                  name="Acum. Real"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="proyectadoAcum"
                  name="Acum. Proyectado"
                  stroke="var(--chart-2)"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
                {/* Línea objetivo anual */}
                {yearTarget > 0 && (
                  <ReferenceLine
                    y={yearTarget}
                    label={{
                      value: `Meta ${fmt(yearTarget)}`,
                      position: 'right',
                    }}
                    stroke="var(--muted-foreground)"
                    strokeDasharray="4 4"
                  />
                )}
              </LineChart>
            </ChartContainer>
          </div>
        </div>

        {/* KPIs secundarios */}
        <div className="grid grid-cols-1 gap-6 flex-1">
          <SimpleStatCard
            label="Promedios"
            value={`Mensual: ${fmt(yearF?.promedioMensual)}`}
            variation={`Diario: ${fmt(monthF?.promedioDiario)}`}
            variationColor="text-muted-foreground"
          />
          <StatCard
            title="Meses (año)"
            main={`${yearF?.mesesRegistrados ?? 0} con datos`}
            sub={
              <>
                Restantes:{' '}
                <Badge variant="secondary">{yearF?.mesesRestantes ?? 0}</Badge>
              </>
            }
          />
          <StatCard
            title="Días (mes)"
            main={`${monthF?.diasRegistrados ?? 0} registrados`}
            sub={
              <>
                Restantes:{' '}
                <Badge variant="secondary">{monthF?.diasRestantes ?? 0}</Badge>
              </>
            }
          />
        </div>
      </div>
    </div>
  );
};
