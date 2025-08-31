import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScreenTitle } from '../components/shared/ScreenTitle';
import { ConsumptionService } from '@/services/ConsumptionService';
import { ChartConfig } from '@/components/ui/chart';
import { getHourlyChartData } from '@/utils/getHourlyChartData';
import { getMonthlyChartData } from '@/utils/getMonthlyChartData';
import { ChartErrorScreen } from '@/components/shared/error/ChartErrorScreen';
import { TodaysConsumptionChart } from '@/components/consumption/TodaysConsumptionChart';
import { MonthlyConsumptionChart } from '../components/consumption/MonthlyConsumptionChart';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toISODate } from '@/utils/toISODate';
import { StatCard } from '@/components/shared/StatCard';
import {
  MonthlyConsumptionResponse,
  TodaysConsumptionResponse,
} from '@/infraestructure/interfaces/consumption.interfaces';

type MonthlyDay = {
  _id: string;
  fecha: string; // "YYYY-MM-DD"
  __v: number;
  horaPico: string; // locale string
  picoConsumo: number; // instantaneous peak
  totalDia: number; // actual daily consumption
};

function formatUnit(n: number) {
  return `${(n ?? 0).toFixed(2)} m³`;
}

function isToday(d: Date) {
  return toISODate(d) === toISODate(new Date());
}

const MONTHS = [
  { label: 'Enero', value: 1 },
  { label: 'Febrero', value: 2 },
  { label: 'Marzo', value: 3 },
  { label: 'Abril', value: 4 },
  { label: 'Mayo', value: 5 },
  { label: 'Junio', value: 6 },
  { label: 'Julio', value: 7 },
  { label: 'Agosto', value: 8 },
  { label: 'Septiembre', value: 9 },
  { label: 'Octubre', value: 10 },
  { label: 'Noviembre', value: 11 },
  { label: 'Diciembre', value: 12 },
];

export const ConsumoScreen: React.FC = () => {
  // Selections
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );

  // ⤷ UI focus (day | month)
  const [view, setView] = useState<'day' | 'month'>('day');

  // Derived params
  const selectedDayISO = useMemo(() => toISODate(selectedDay), [selectedDay]);
  const month = selectedMonth;
  const year = selectedYear;

  // Data
  const [todayData, setTodayData] = useState<TodaysConsumptionResponse | null>(
    null
  );
  const [monthData, setMonthData] = useState<MonthlyConsumptionResponse | null>(
    null
  );

  const [loadingToday, setLoadingToday] = useState(false);
  const [loadingMonth, setLoadingMonth] = useState(false);
  const [errorToday, setErrorToday] = useState<string | null>(null);
  const [errorMonth, setErrorMonth] = useState<string | null>(null);

  // Effects
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingToday(true);
      setErrorToday(null);
      try {
        const res = await ConsumptionService.getTodaysConsumption({
          fecha: selectedDayISO,
        });
        if (mounted) setTodayData(res);
      } catch (err: any) {
        if (mounted)
          setErrorToday(err?.message ?? 'Error al cargar consumo de hoy');
      } finally {
        if (mounted) setLoadingToday(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [selectedDayISO]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingMonth(true);
      setErrorMonth(null);
      try {
        const res = await ConsumptionService.getMonthlyConsumption({
          mes: month,
          anio: year,
        });
        if (mounted) setMonthData(res);
      } catch (err: any) {
        if (mounted)
          setErrorMonth(err?.message ?? 'Error al cargar consumo mensual');
      } finally {
        if (mounted) setLoadingMonth(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [month, year]);

  // Transforms
  const hourlyChart = useMemo(() => getHourlyChartData(todayData), [todayData]);
  const monthlyChart = useMemo(
    () => getMonthlyChartData(monthData),
    [monthData]
  );

  const hourlyChartConfig = {
    hour: { label: 'Hora' },
    cumulado: { label: 'Acumulado' },
    consumo: { label: 'Consumo' },
  } satisfies ChartConfig;

  const monthlyChartConfig = {
    totalDia: { label: 'Total del Día' },
    MA7: { label: 'Media Móvil (7d)' },
    pico: { label: 'Pico' },
  } satisfies ChartConfig;

  // DERIVED STATS FUNCTIONS
  const {
    peakHourToday,
    peakDeltaToday,
    daysCount,
    monthlyAvg,
    bestDay,
    worstDay,
    missingDays,
  } = useMemo(() => {
    let peakDelta = 0;
    let peakHourLabel: string | null = null;
    if (todayData?.datos?.length) {
      for (let i = 1; i < todayData.datos.length; i++) {
        const prev = todayData.datos[i - 1];
        const cur = todayData.datos[i];
        const delta = cur.lectura - prev.lectura;
        if (delta > peakDelta) {
          peakDelta = delta;
          peakHourLabel = cur.hora;
        }
      }
    }

    const days: MonthlyDay[] = monthData?.datos?.datos ?? [];
    const count = days.length;
    const total = monthData?.datos?.consumoTotal ?? 0;
    const avg = count > 0 ? total / count : 0;

    let best: MonthlyDay | null = null;
    let worst: MonthlyDay | null = null;

    if (count > 0) {
      // Initialize with first day to avoid null checks inside loop
      best = days[0];
      worst = days[0];
      for (let i = 1; i < days.length; i++) {
        const d = days[i];
        if (d.totalDia < best.totalDia) best = d;
        if (d.totalDia > worst.totalDia) worst = d;
      }
    }

    const daysInMonth = new Date(year, month, 0).getDate();
    const missing = Math.max(0, daysInMonth - count);

    return {
      peakHourToday: peakHourLabel,
      peakDeltaToday: peakDelta,
      daysCount: count,
      monthlyAvg: avg,
      bestDay: best,
      worstDay: worst,
      missingDays: missing,
    };
  }, [todayData, monthData, month, year]);

  if (loadingMonth || loadingToday) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-regular">Consumo</h1>
        <div className="h-24 animate-pulse bg-muted/50 rounded-md" />
        <div className="h-64 animate-pulse bg-muted/50 rounded-md" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <ScreenTitle label="Consumo" />
        {/* <Button variant="outline" size="sm" onClick={() => window.print()}>
          Imprimir Factura
        </Button> */}
      </div>

      {/*  Focus switch  */}
      <Tabs value={view} onValueChange={(v) => setView(v as 'day' | 'month')}>
        <TabsList>
          <TabsTrigger value="day">Día</TabsTrigger>
          <TabsTrigger value="month">Mes</TabsTrigger>
        </TabsList>

        {/* ===== DAY VIEW ===== */}
        <TabsContent value="day" className="mt-4 space-y-4">
          {/* KPIs for Day */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <StatCard
              title={`Total ${
                isToday(selectedDay) ? '(hoy)' : toISODate(selectedDay)
              }`}
              main={formatUnit(hourlyChart.total || 0)}
              sub={
                peakHourToday ? (
                  <>
                    Pico {peakHourToday} ·{' '}
                    <Badge variant="secondary">
                      {formatUnit(peakDeltaToday || 0)}
                    </Badge>
                  </>
                ) : (
                  ' '
                )
              }
            />
            <StatCard
              title="Promedio horario (aprox.)"
              main={formatUnit(
                (hourlyChart.total || 0) /
                  Math.max(1, todayData?.datos?.length || 1)
              )}
              sub="Calculado a partir de lecturas del día"
            />
            <StatCard
              title="Fecha seleccionada"
              main={toISODate(selectedDay)}
              sub="Cambia la fecha para comparar"
            />
            <StatCard
              title="Cobertura del día"
              main={`${todayData?.datos?.length ?? 0} lecturas`}
              sub="Muestras registradas"
            />
          </div>

          {/* Controls + Chart */}
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardContent className="pt-6 flex flex-col">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-semibold">
                      Consumo por Hora (Día)
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Selecciona un día para analizar
                    </p>
                  </div>
                  <div className="hidden md:block">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline">
                          {isToday(selectedDay)
                            ? `Hoy (${toISODate(selectedDay)})`
                            : toISODate(selectedDay)}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="flex justify-center items-center">
                        <Calendar
                          mode="single"
                          selected={selectedDay}
                          onSelect={(d) => d && setSelectedDay(d)}
                          disabled={(date) => date > new Date()}
                          className="rounded-md border"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="md:hidden">
                    <input
                      type="date"
                      className="border rounded-md px-2 py-1 text-sm"
                      value={toISODate(selectedDay)}
                      max={toISODate(new Date())}
                      onChange={(e) => setSelectedDay(new Date(e.target.value))}
                    />
                  </div>
                </div>

                <div className="flex items-baseline justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Total del día: {formatUnit(hourlyChart.total || 0)}
                  </p>
                  {peakHourToday && (
                    <p className="text-xs text-muted-foreground">
                      Hora pico: <strong>{peakHourToday}</strong> (
                      {formatUnit(peakDeltaToday || 0)})
                    </p>
                  )}
                </div>

                {loadingToday ? (
                  <div className="h-[220px] animate-pulse bg-muted/50 rounded-md mt-4" />
                ) : errorToday ? (
                  <ChartErrorScreen errorMessage={errorToday} />
                ) : (
                  <TodaysConsumptionChart
                    config={hourlyChartConfig}
                    data={hourlyChart}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ===== MONTH VIEW ===== */}
        <TabsContent value="month" className="mt-4 space-y-4">
          {/* KPIs for Month */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <StatCard
              title="Total (mes)"
              main={formatUnit(monthlyChart.consumoTotal || 0)}
              sub={
                <>
                  Promedio diario ·{' '}
                  <Badge variant="outline">{formatUnit(monthlyAvg || 0)}</Badge>
                </>
              }
            />
            <StatCard
              title="Mejor día"
              main={bestDay ? formatUnit(bestDay.totalDia) : '—'}
              sub={bestDay ? bestDay.fecha : 'Sin datos'}
            />
            <StatCard
              title="Peor día"
              main={worstDay ? formatUnit(worstDay.totalDia) : '—'}
              sub={worstDay ? worstDay.fecha : 'Sin datos'}
            />
            <StatCard
              title="Cobertura"
              main={`${daysCount} días`}
              sub={
                <>
                  Faltantes: <Badge variant="destructive">{missingDays}</Badge>
                </>
              }
            />
          </div>

          {/* Controls + Chart */}
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold">
                      Consumo Diario (Mes)
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Periodo: {MONTHS.find((m) => m.value === month)?.label}{' '}
                      {year}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Select
                      value={String(month)}
                      onValueChange={(v) => setSelectedMonth(Number(v))}
                    >
                      <SelectTrigger className="w-[140px] h-9">
                        <SelectValue placeholder="Mes" />
                      </SelectTrigger>
                      <SelectContent>
                        {MONTHS.map((m) => (
                          <SelectItem key={m.value} value={String(m.value)}>
                            {m.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={String(year)}
                      onValueChange={(v) => setSelectedYear(Number(v))}
                    >
                      <SelectTrigger className="w-[110px] h-9">
                        <SelectValue placeholder="Año" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from(
                          { length: 7 },
                          (_, i) => new Date().getFullYear() - 5 + i
                        ).map((y) => (
                          <SelectItem key={y} value={String(y)}>
                            {y}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-baseline justify-between mt-3">
                  <p className="text-sm text-muted-foreground">
                    Total del mes: {formatUnit(monthlyChart.consumoTotal || 0)}
                  </p>
                  {monthData?.datos?.datos?.length ? (
                    <p className="text-xs text-muted-foreground">
                      Media móvil 7d
                    </p>
                  ) : null}
                </div>

                {loadingMonth ? (
                  <div className="h-[220px] animate-pulse bg-muted/50 rounded-md mt-4" />
                ) : errorMonth ? (
                  <ChartErrorScreen errorMessage={errorMonth} />
                ) : (
                  <>
                    <MonthlyConsumptionChart
                      config={monthlyChartConfig}
                      data={monthlyChart}
                    />
                    <p className="text-xs text-muted-foreground mt-3">
                      Consejo: la línea muestra una media móvil de 7 días.
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConsumoScreen;
