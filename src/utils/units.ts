export const cmToMeters = (cm: number) => cm / 100;

export const roundTo = (value: number, decimals = 2) =>
  Math.round(value * 10 ** decimals) / 10 ** decimals;
