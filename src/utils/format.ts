export const formatNumber = (value: number, digits = 0) =>
  value.toLocaleString('fr-FR', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

export const formatPercentage = (value: number) => `${Math.round(value * 100)}%`;

export const formatKcal = (value: number) => `${Math.round(value)} kcal`;
