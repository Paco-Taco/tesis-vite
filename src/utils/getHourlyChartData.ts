import { TodayPoint } from '@/infraestructure/types/consumption.types';
import { TodaysConsumptionResponse } from '../infraestructure/interfaces/consumption.interfaces';

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

export const getHourlyChartData = (
  todayData: TodaysConsumptionResponse | null
) => {
  if (!todayData) return { bars: [], total: 0 };
  const bars = computeHourlyDeltas(todayData.datos).map((d) => ({
    hour: d.hour,
    consumo: +d.delta.toFixed(2),
    cumulado: +d.lectura.toFixed(2),
  }));
  const total = bars.length
    ? bars[bars.length - 1].cumulado - bars[0].cumulado
    : 0;
  return { bars, total };
};
