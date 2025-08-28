import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScreenTitle } from '../components/shared/ScreenTitle';
import { ConsumptionService } from '@/services/ConsumptionService';
import { ChartConfig } from '@/components/ui/chart';
import { getHourlyChartData } from '@/utils/getHourlyChartData';
import { getMonthlyChartData } from '@/utils/getMonthlyChartData';
import { ChartErrorScreen } from '@/components/shared/error/ChartErrorScreen';
import { TodaysConsumptionChart } from '@/components/forecast/consumption/TodaysConsumptionChart';
import { MonthlyConsumptionChart } from '../components/forecast/consumption/MonthlyConsumptionChart';

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
  total: number;
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

function formatUnit(n: number) {
  return `${n.toFixed(2)} u`; // adapt to L or m³ when confirmed
}

// ===== Screen =====
export const ConsumoScreen: React.FC = () => {
  // You can control these with date pickers / selectors in your UI
  const todayISO = '2025-08-25';
  const month = 8; // June
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
  const hourlyChart = useMemo(() => getHourlyChartData(todayData), [todayData]);
  const monthlyChart = useMemo(
    () => getMonthlyChartData(monthData),
    [monthData]
  );

  const hourlyChartConfig = {
    hour: {
      label: 'Hora',
    },
    consumo: {
      label: 'Consumo',
    },
    cumulado: {
      label: 'Acumulado',
    },
  } satisfies ChartConfig;

  const monthlyChartConfig = {
    totalDia: {
      label: 'Total del Día',
    },
    MA7: {
      label: 'Media Móvil (7d)',
    },
    pico: {
      label: 'Pico',
    },
  } satisfies ChartConfig;

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
          <CardContent className="pt-6 flex flex-col">
            <div className="flex items-baseline justify-between">
              <h3 className="text-lg font-semibold">Consumo por Hora (Hoy)</h3>
              <p className="text-sm text-muted-foreground">
                Total del día: {formatUnit(hourlyChart.total)}
              </p>
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
              <ChartErrorScreen errorMessage={errorMonth} />
            ) : (
              <>
                <MonthlyConsumptionChart
                  config={monthlyChartConfig}
                  data={monthlyChart}
                />
                <p className="text-xs text-muted-foreground mt-3">
                  Consejo: la línea muestra una media móvil de 7 días; los picos
                  instantáneos (picoConsumo) están disponibles en el tooltip de
                  cada barra.
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConsumoScreen;
