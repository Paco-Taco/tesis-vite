export function getMonthStatus(
  progress: number,
  daysDone: number,
  daysLeft: number
) {
  const total = Math.max(1, daysDone + daysLeft);
  const expected = daysDone / total;
  const delta = progress - expected; // positive = adelantado

  if (delta > 0.05) return { label: 'Adelantado', tone: 'text-emerald-600' };
  if (delta < -0.05) return { label: 'En riesgo', tone: 'text-red-600' };
  return { label: 'A tiempo', tone: 'text-amber-600' };
}
