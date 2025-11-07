export type BmrInput = {
  sex: 'male' | 'female' | 'other';
  weightKg: number;
  heightCm: number;
  age: number;
};

export const bmrMifflinStJeor = ({ sex, weightKg, heightCm, age }: BmrInput) => {
  if (weightKg <= 0 || heightCm <= 0 || age <= 0) {
    throw new Error('Invalid inputs for BMR');
  }
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (sex === 'male') {
    return base + 5;
  }
  if (sex === 'female') {
    return base - 161;
  }
  return base - 78;
};
