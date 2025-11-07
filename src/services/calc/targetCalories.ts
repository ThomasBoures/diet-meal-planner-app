import { roundTo } from '../../utils/units';

type TargetInput = {
  tdee: number;
  deficitPct?: number;
  minFemale?: number;
  minMale?: number;
  absoluteMin?: number;
  sex: 'male' | 'female' | 'other';
};

const DEFAULTS = {
  deficitPct: 0.2,
  minFemale: 1200,
  minMale: 1500,
  absoluteMin: 1000,
};

export const lossTarget = ({
  tdee,
  deficitPct = DEFAULTS.deficitPct,
  minFemale = DEFAULTS.minFemale,
  minMale = DEFAULTS.minMale,
  absoluteMin = DEFAULTS.absoluteMin,
  sex,
}: TargetInput) => {
  if (tdee <= 0) {
    throw new Error('Invalid TDEE');
  }
  const raw = tdee * (1 - deficitPct);
  const floor = sex === 'male' ? minMale : sex === 'female' ? minFemale : (minMale + minFemale) / 2;
  return roundTo(Math.max(raw, floor, absoluteMin), 0);
};
