import { MonthlyDay, TodayPoint } from '../types/consumption.types';

export interface TodaysConsumptionResponse {
  mensaje: string;
  total: number; // expected 24
  datos: TodayPoint[];
}

export interface MonthlyConsumptionResponse {
  mensaje: string; // "Resultados encontrados para m/YYYY"
  datos: {
    consumoTotal: number;
    datos: MonthlyDay[];
  };
}
