import { MonthlyConsumptionResponse } from '@/infraestructure/interfaces/consumption.interfaces';

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

export const getMonthlyChartData = (
  monthData: MonthlyConsumptionResponse | null
) => {
  if (!monthData) return { days: [], consumoTotal: 0 };
  const daysRaw = [...monthData.datos.datos].sort((a, b) =>
    a.fecha.localeCompare(b.fecha)
  );
  const values = daysRaw.map((d) => d.totalDia);
  const ma7 = movingAverage(values, 7);
  const days = daysRaw.map((d, i) => ({
    day: d.fecha.slice(8, 10), // DD
    fecha: d.fecha,
    totalDia: +d.totalDia.toFixed(3),
    MA7: ma7[i],
    pico: +d.picoConsumo.toFixed(5),
    horaPico: d.horaPico,
  }));
  const consumoTotal = +monthData.datos.consumoTotal.toFixed(4);
  return { days, consumoTotal };
};
