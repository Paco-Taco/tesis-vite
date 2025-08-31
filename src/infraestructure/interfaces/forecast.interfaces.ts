export interface CurrentMonthForecast {
  mes: string;
  promedioDiario: number;
  diasRegistrados: number;
  diasRestantes: number;
  consumoActual: number;
  estimadoRestante: number;
  estimadoTotalMes: number;
}

export interface CurrentYearForecast {
  anio: number;
  promedioMensual: number;
  mesesRegistrados: number;
  consumoActual: number;
  mesesRestantes: number;
  estimadoRestante: number;
  estimadoTotalAnio: number;
  consumoPorMes: ConsumoPorMes[];
}

export interface ConsumoPorMes {
  mes: string;
  total: number;
}
