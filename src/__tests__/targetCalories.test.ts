import { lossTarget } from '../services/calc/targetCalories';

describe('lossTarget', () => {
  it('applies default deficit', () => {
    expect(lossTarget({ tdee: 2200, sex: 'male' })).toBeCloseTo(1760, 0);
  });

  it('respects minimum for female', () => {
    expect(lossTarget({ tdee: 1300, sex: 'female' })).toBeGreaterThanOrEqual(1200);
  });

  it('never goes below absolute minimum', () => {
    expect(lossTarget({ tdee: 900, sex: 'male' })).toBe(1500);
  });
});
