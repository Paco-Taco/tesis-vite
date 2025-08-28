export type MonthlyDay = {
  _id: string;
  fecha: string; // "YYYY-MM-DD"
  __v: number;
  horaPico: string; // locale string in payload
  picoConsumo: number; // instantaneous peak
  totalDia: number; // actual daily consumption
};

export type TodayPoint = {
  _id: string;
  fecha: string; // "YYYY-MM-DD"
  hora: string; // "HH:mm"
  lectura: number; // cumulative reading
  createdAt: string;
  __v: number;
};
