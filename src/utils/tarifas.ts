export const tarifas = {
  R: [30, 20, 25, 25, 0, 1],
  DA: [15, 15, 20, 25, 25, 1],
  DB: [15, 15, 20, 25, 25, 1],
  C: [50, 50, 100, 200, 400, 1],
  CA: [25, 25, 25, 50, 0, 1],
  CB: [25, 25, 25, 50, 0, 1],
  I: [30, 70, 100, 100, 0, 1],
};

export const precios = {
  R: [1.993, 0.068, 0.071, 0.074, 0, 0.161],
  DA: [2.342, 0.085, 0.095, 0.107, 0.228, 0.457],
  DB: [4.573, 0.171, 0.195, 0.219, 0.435, 0.468],
  C: [7.175, 0.2, 0.207, 0.322, 0.371, 0.468],
  CA: [6.47, 0.289, 0.323, 0.382, 0, 0.503],
  CB: [8.59, 0.406, 0.417, 0.45, 0, 0.51],
  I: [8.59, 0.406, 0.417, 0.45, 0, 0.51],
};

// Range names in order: B, IL, IM, IH, H, S (excedente)
export const RANGE_NAMES = [
  'Básico',
  'Intermedio bajo',
  'Intermedio medio',
  'Intermedio alto',
  'Alto',
  'Excedente',
] as const;

export type TarifaCode = keyof typeof tarifas;

export function getCaps(tarifaCode: TarifaCode) {
  const arr = tarifas[tarifaCode] ?? [];
  // first 5 are finite caps
  const caps = arr.slice(0, 5).map((n) => Math.max(0, n));
  const totalCap = caps.reduce((a, b) => a + b, 0);
  return { caps, totalCap };
}

export function getCurrentRange(consumo: number, tarifaCode: TarifaCode) {
  const { caps, totalCap } = getCaps(tarifaCode);
  let restante = Math.max(0, consumo);

  // Walk the 5 finite blocks
  for (let i = 0; i < caps.length; i++) {
    const take = Math.min(restante, caps[i]);
    if (restante <= caps[i]) {
      return {
        index: i, // 0..4 inside caps
        name: RANGE_NAMES[i],
        toNext: Math.max(0, caps[i] - restante), // how much left to next range
        totalCap,
      };
    }
    restante -= take;
  }

  // Excedente
  return { index: 5, name: RANGE_NAMES[5], toNext: 0, totalCap };
}
