export const calcularRangosConsumo = (consumo, tarifaId, tarifas) => {
  const [b, il, im, ih, h] = tarifas[tarifaId];
  let result = { B: 0, IL: 0, IM: 0, IH: 0, H: 0, S: 0 };

  if (consumo <= b) result.B = consumo;
  else if (consumo <= b + il) result = { B: b, IL: consumo - b };
  else if (consumo <= b + il + im)
    result = { B: b, IL: il, IM: consumo - b - il };
  else if (consumo <= b + il + im + ih)
    result = { B: b, IL: il, IM: im, IH: consumo - b - il - im };
  else if (consumo <= b + il + im + ih + h)
    result = { B: b, IL: il, IM: im, IH: ih, H: consumo - b - il - im - ih };
  else
    result = {
      B: b,
      IL: il,
      IM: im,
      IH: ih,
      H: h,
      S: consumo - b - il - im - ih - h,
    };

  return result;
};

export const getColorPorRango = (consumo, tarifaId, tarifas) => {
  const total = tarifas[tarifaId].reduce((a, b) => a + b, 0);
  const ratio = consumo / total;

  if (ratio <= 0.4) return '#60D394'; // verde
  if (ratio <= 0.7) return '#F7CB73'; // amarillo
  if (ratio <= 1) return '#F18F01'; // naranja
  return '#D7263D'; // rojo (excedente)
};
