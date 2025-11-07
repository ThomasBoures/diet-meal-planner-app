type MacroInput = {
  kcal: number;
  pPct?: number;
  cPct?: number;
  fPct?: number;
};

const kcalsPerGram = {
  protein: 4,
  carbs: 4,
  fat: 9,
};

export const macroTargets = ({ kcal, pPct = 0.3, cPct = 0.4, fPct = 0.3 }: MacroInput) => {
  if (kcal <= 0) {
    throw new Error('Invalid calories');
  }
  const totalPct = pPct + cPct + fPct;
  if (Math.abs(totalPct - 1) > 0.01) {
    throw new Error('Macro percentages must total ~100%');
  }
  return {
    protein_g: (kcal * pPct) / kcalsPerGram.protein,
    carbs_g: (kcal * cPct) / kcalsPerGram.carbs,
    fat_g: (kcal * fPct) / kcalsPerGram.fat,
  };
};

type SplitInput = {
  kcal: number;
  split?: {
    snack: number;
    breakfast: number;
    lunch: number;
    dinner: number;
  };
};

const defaultSplit = {
  snack: 0.1,
  breakfast: 0.25,
  lunch: 0.35,
  dinner: 0.3,
};

export const splitByMeals = ({ kcal, split = defaultSplit }: SplitInput) => {
  if (kcal <= 0) {
    throw new Error('Invalid calories to split');
  }
  const total = Object.values(split).reduce((acc, value) => acc + value, 0);
  if (Math.abs(total - 1) > 0.01) {
    throw new Error('Meal split must total ~100%');
  }
  return {
    snack: kcal * split.snack,
    breakfast: kcal * split.breakfast,
    lunch: kcal * split.lunch,
    dinner: kcal * split.dinner,
  };
};
