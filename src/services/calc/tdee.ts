export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'high' | 'very_high';

const activityMap: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  high: 1.725,
  very_high: 1.9,
};

export const activityFactor = (level: ActivityLevel) => activityMap[level];

export const tdee = ({ bmr, level }: { bmr: number; level: ActivityLevel }) => {
  if (bmr <= 0) {
    throw new Error('Invalid BMR');
  }
  return bmr * activityFactor(level);
};
