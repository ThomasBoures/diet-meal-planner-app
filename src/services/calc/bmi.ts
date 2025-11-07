import { cmToMeters } from '../../utils/units';

export type BmiInput = {
  weightKg: number;
  heightCm: number;
};

export const bmi = ({ weightKg, heightCm }: BmiInput) => {
  if (heightCm <= 0 || weightKg <= 0) {
    throw new Error('Invalid anthropometrics');
  }
  const heightM = cmToMeters(heightCm);
  return weightKg / (heightM * heightM);
};

export type BmiCategory = 'under' | 'normal' | 'over' | 'obese';

export const bmiCategory = (value: number): BmiCategory => {
  if (value < 18.5) {
    return 'under';
  }
  if (value < 25) {
    return 'normal';
  }
  if (value < 30) {
    return 'over';
  }
  return 'obese';
};
