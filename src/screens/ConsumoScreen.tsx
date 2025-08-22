import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScreenTitle } from '../components/shared/ScreenTitle';
import {
  BarChart,
  Bar,
  Line,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { ConsumptionService } from '@/services/ConsumptionService';

// 👉 Swap these imports to your real axios services
// import { getTodaysConsumption, getMonthlyConsumption } from "@/services/consumption";

// ===== Types based on your payloads =====
export interface TodaysConsumptionPayload {
  fecha: string;
}

export interface MonthlyConsumptionPayload {
  mes: number;
  anio: number;
}

type TodayPoint = {
  _id: string;
  fecha: string; // "YYYY-MM-DD"
  hora: string; // "HH:mm"
  lectura: number; // cumulative reading
  createdAt: string;
  __v: number;
};

interface TodaysConsumptionResponse {
  mensaje: string;
  total: number; // expected 24
  datos: TodayPoint[];
}

type MonthlyDay = {
  _id: string;
  fecha: string; // "YYYY-MM-DD"
  __v: number;
  horaPico: string; // locale string in payload
  picoConsumo: number; // instantaneous peak
  totalDia: number; // actual daily consumption
};

interface MonthlyConsumptionResponse {
  mensaje: string; // "Resultados encontrados para m/YYYY"
  datos: {
    consumoTotal: number;
    datos: MonthlyDay[];
  };
}

// ===== Utilities =====
function computeHourlyDeltas(points: TodayPoint[]) {
  const sorted = [...points].sort((a, b) => a.hora.localeCompare(b.hora));
  const deltas = sorted.map((p, idx) => {
    if (idx === 0) return { hour: p.hora, delta: 0, lectura: p.lectura };
    const prev = sorted[idx - 1];
    const raw = p.lectura - prev.lectura;
    const delta = raw < 0 ? 0 : raw; // safety: no negatives
    return { hour: p.hora, delta, lectura: p.lectura };
  });
  return deltas;
}

function movingAverage(values: number[], window = 7) {
  const out: (number | null)[] = Array(values.length).fill(null);
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    sum += values[i];
    if (i >= window) sum -= values[i - window];
    if (i >= window - 1) out[i] = +(sum / window).toFixed(2);
  }
  return out;
}

function formatUnit(n: number) {
  return `${n.toFixed(2)} u`; // adapt to L or m³ when confirmed
}

// ===== Screen =====
export const ConsumoScreen: React.FC = () => {
  // You can control these with date pickers / selectors in your UI
  const todayISO = '2025-06-02';
  const month = 6; // June
  const year = 2025;

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

  // Fetch today
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingToday(true);
      setErrorToday(null);
      try {
        const res = await ConsumptionService.getTodaysConsumption({
          fecha: todayISO,
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
  }, [todayISO]);

  // Fetch month
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

  // Transformations
  const hourlyChart = useMemo(() => {
    if (!todayData) return { bars: [], total: 0 };
    const bars = computeHourlyDeltas(todayData.datos).map((d) => ({
      hour: d.hour,
      Consumo: +d.delta.toFixed(2),
      Cumulado: +d.lectura.toFixed(2),
    }));
    const total = bars.length
      ? bars[bars.length - 1].Cumulado - bars[0].Cumulado
      : 0;
    return { bars, total };
  }, [todayData]);

  const monthlyChart = useMemo(() => {
    if (!monthData) return { days: [], consumoTotal: 0 };
    const daysRaw = [...monthData.datos.datos].sort((a, b) =>
      a.fecha.localeCompare(b.fecha)
    );
    const values = daysRaw.map((d) => d.totalDia);
    const ma7 = movingAverage(values, 7);
    const days = daysRaw.map((d, i) => ({
      day: d.fecha.slice(8, 10), // DD
      Fecha: d.fecha,
      TotalDia: +d.totalDia.toFixed(3),
      MA7: ma7[i],
      Pico: +d.picoConsumo.toFixed(5),
      HoraPico: d.horaPico,
    }));
    const consumoTotal = +monthData.datos.consumoTotal.toFixed(4);
    return { days, consumoTotal };
  }, [monthData]);

  return (
    <div className="space-y-6">
      <ScreenTitle label="Consumo" />

      <div className="flex justify-end items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => window.print()}>
          Imprimir Factura
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ----- HOURLY (Today) ----- */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-baseline justify-between">
              <h3 className="text-lg font-semibold">Consumo por Hora (Hoy)</h3>
              <p className="text-sm text-muted-foreground">
                Total del día: {formatUnit(hourlyChart.total)}
              </p>
            </div>

            {loadingToday ? (
              <div className="h-[220px] animate-pulse bg-muted/50 rounded-md mt-4" />
            ) : errorToday ? (
              <p className="text-sm text-destructive mt-2">{errorToday}</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart
                  data={hourlyChart.bars}
                  margin={{ top: 20, right: 24, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" tick={{ fontSize: 12 }} interval={2} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value: any, name: string) => {
                      if (name === 'Consumo')
                        return [formatUnit(value as number), name];
                      if (name === 'Cumulado')
                        return [formatUnit(value as number), name];
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="Consumo" fillOpacity={0.3} />
                  <Line
                    type="monotone"
                    dataKey="Cumulado"
                    strokeWidth={2}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* ----- DAILY (Month) ----- */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-baseline justify-between">
              <h3 className="text-lg font-semibold">Consumo Diario (Mes)</h3>
              <p className="text-sm text-muted-foreground">
                Total del mes: {formatUnit(monthlyChart.consumoTotal)}
              </p>
            </div>

            {loadingMonth ? (
              <div className="h-[220px] animate-pulse bg-muted/50 rounded-md mt-4" />
            ) : errorMonth ? (
              <p className="text-sm text-destructive mt-2">{errorMonth}</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={monthlyChart.days}
                  margin={{ top: 20, right: 24, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value: any, name: string) => {
                      if (name === 'TotalDia')
                        return [formatUnit(value as number), 'Total del día'];
                      if (name === 'MA7')
                        return [formatUnit(value as number), 'Media móvil 7d'];
                      if (name === 'Pico') return [value, 'Pico (inst.)'];
                      return [value, name];
                    }}
                    labelFormatter={(label) => `Día ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="TotalDia" />
                  <Line
                    type="monotone"
                    dataKey="MA7"
                    strokeWidth={2}
                    dot={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}

            <p className="text-xs text-muted-foreground mt-2">
              Consejo: la línea muestra una media móvil de 7 días; los picos
              instantáneos (picoConsumo) están disponibles en el tooltip de cada
              barra.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConsumoScreen;
