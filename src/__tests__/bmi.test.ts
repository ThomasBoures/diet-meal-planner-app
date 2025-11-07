import { bmi, bmiCategory } from '../services/calc/bmi';

describe('bmi', () => {
  it('calculates BMI correctly', () => {
    expect(bmi({ weightKg: 70, heightCm: 170 })).toBeCloseTo(24.22, 2);
  });

  it('throws on invalid input', () => {
    expect(() => bmi({ weightKg: 0, heightCm: 170 })).toThrow('Invalid anthropometrics');
  });
});

describe('bmiCategory', () => {
  it('classifies underweight', () => {
    expect(bmiCategory(18)).toBe('under');
  });

  it('classifies normal', () => {
    expect(bmiCategory(22)).toBe('normal');
  });

  it('classifies overweight', () => {
    expect(bmiCategory(28)).toBe('over');
  });

  it('classifies obese', () => {
    expect(bmiCategory(31)).toBe('obese');
  });
});
