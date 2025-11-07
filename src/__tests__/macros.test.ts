import { macroTargets, splitByMeals } from '../services/calc/macros';

describe('macroTargets', () => {
  it('returns grams per macro', () => {
    const macros = macroTargets({ kcal: 2000 });
    expect(macros.protein_g).toBeCloseTo(150, 0);
    expect(macros.carbs_g).toBeCloseTo(200, 0);
    expect(macros.fat_g).toBeCloseTo(66.66, 1);
  });

  it('throws when ratios invalid', () => {
    expect(() => macroTargets({ kcal: 2000, pPct: 0.5, cPct: 0.5, fPct: 0.2 })).toThrow('Macro percentages');
  });
});

describe('splitByMeals', () => {
  it('splits calories according to ratio', () => {
    const split = splitByMeals({ kcal: 2000 });
    expect(split.snack).toBeCloseTo(200, 0);
    expect(split.breakfast).toBeCloseTo(500, 0);
    expect(split.lunch).toBeCloseTo(700, 0);
    expect(split.dinner).toBeCloseTo(600, 0);
  });
});
