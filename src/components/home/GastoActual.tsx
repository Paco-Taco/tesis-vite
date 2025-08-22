import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { calcularTotalAPagar } from '@/utils/CalcularTotalAPagar';
// @ts-ignore
import { getColorPorRango } from '@/utils/calculosConsumo';
import { precios, tarifas } from '@/utils/tarifas';
import { useTarifaStore } from '@/store/useTarifaStore';
import { ConsumoDiario } from '@/types/consumoTypes';

interface GastoActualTypes {
  consumoDelDia: ConsumoDiario | null;
}

export const GastoActual = ({ consumoDelDia }: GastoActualTypes) => {
  const { currentTarifa } = useTarifaStore();

  const gastoAcumulado = calcularTotalAPagar(
    consumoDelDia?.lectura ?? 0,
    currentTarifa, // recuerda mandar tarifa dinamicamente
    tarifas,
    precios
  );

  const colorCirculo = getColorPorRango(
    consumoDelDia?.lectura,
    currentTarifa,
    tarifas
  );

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Gasto Actual</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-grow justify-center items-center py-6">
        <div
          className="flex flex-col w-70 h-70 border-[14px] p-2 rounded-full items-center justify-center"
          style={{ borderColor: colorCirculo }}
        >
          <span className="text-lg font-regular text-gray-500">Total</span>
          <span className="text-2xl font-bold text-primary">
            ${gastoAcumulado}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
