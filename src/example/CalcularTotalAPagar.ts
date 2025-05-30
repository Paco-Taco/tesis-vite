export const calcularTotalAPagar = (consumo, tarifaCode, rangos, precios) => {
  const bloques = rangos[tarifaCode];
  const preciosPorBloque = precios[tarifaCode];

  let restante = consumo;
  let total = 0;

  for (let i = 0; i < bloques.length; i++) {
    const limite = bloques[i];
    const precio = preciosPorBloque[i];

    if (i === bloques.length - 1) {
      // Excedente: cobra todo lo que queda sin límite
      total += restante * precio;
      break;
    }

    const consumoEnBloque = Math.min(restante, limite);
    total += consumoEnBloque * precio;
    restante -= consumoEnBloque;

    if (restante <= 0) break;
  }

  return parseFloat(total.toFixed(2));
};
