export interface ConsumoDiario {
  timestamp: string;
  lectura: number | undefined;
  consumo: number;
  tiempo: number;
  tasa: number;
}
