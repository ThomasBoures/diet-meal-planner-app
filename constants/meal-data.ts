export type MealCategory = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export type DietaryPreference =
  | 'balanced'
  | 'vegetarian'
  | 'vegan'
  | 'pescatarian'
  | 'high-protein'
  | 'low-carb';

export type ActivityLevel = 'sedentary' | 'lightly-active' | 'moderately-active' | 'very-active';

export interface MealOption {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  description: string;
  dietaryTags: Array<
    'balanced' | 'vegetarian' | 'vegan' | 'pescatarian' | 'high-protein' | 'low-carb'
  >;
}

export const MEAL_CATEGORY_LABELS: Record<MealCategory, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
};

export const DIETARY_PREFERENCE_LABELS: Record<DietaryPreference, string> = {
  balanced: 'Balanced omnivore',
  vegetarian: 'Vegetarian',
  vegan: 'Vegan',
  pescatarian: 'Pescatarian',
  'high-protein': 'High-protein focus',
  'low-carb': 'Lower carbohydrate',
};

export const ACTIVITY_LEVELS: Array<{
  value: ActivityLevel;
  label: string;
  factor: number;
  description: string;
}> = [
  {
    value: 'sedentary',
    label: 'Sedentary',
    factor: 1.2,
    description: 'Little or no exercise, desk job',
  },
  {
    value: 'lightly-active',
    label: 'Lightly active',
    factor: 1.375,
    description: 'Light exercise 1-3 days/week',
  },
  {
    value: 'moderately-active',
    label: 'Moderately active',
    factor: 1.55,
    description: 'Moderate exercise 3-5 days/week',
  },
  {
    value: 'very-active',
    label: 'Very active',
    factor: 1.725,
    description: 'Hard exercise 6-7 days/week',
  },
];

export const CALORIE_SPLIT: Record<MealCategory, number> = {
  breakfast: 0.3,
  lunch: 0.35,
  dinner: 0.25,
  snack: 0.1,
};

export const MEAL_LIBRARY: Record<MealCategory, MealOption[]> = {
  breakfast: [
    {
      id: 'bf-greek-yogurt',
      name: 'Greek yogurt power parfait',
      calories: 430,
      protein: 32,
      carbs: 48,
      fat: 12,
      description: 'Plain Greek yogurt layered with berries, chia seeds, and toasted oats.',
      dietaryTags: ['balanced', 'vegetarian', 'high-protein'],
    },
    {
      id: 'bf-tofu-scramble',
      name: 'Tofu veggie scramble',
      calories: 390,
      protein: 28,
      carbs: 30,
      fat: 18,
      description: 'Tofu sautéed with spinach, peppers, and mushrooms served with sprouted toast.',
      dietaryTags: ['balanced', 'vegetarian', 'vegan', 'high-protein', 'low-carb'],
    },
    {
      id: 'bf-overnight-oats',
      name: 'Almond overnight oats',
      calories: 420,
      protein: 18,
      carbs: 55,
      fat: 14,
      description: 'Rolled oats soaked with almond milk, flax, and sliced banana.',
      dietaryTags: ['balanced', 'vegetarian', 'vegan'],
    },
    {
      id: 'bf-egg-bake',
      name: 'Egg & greens bake',
      calories: 400,
      protein: 30,
      carbs: 20,
      fat: 22,
      description: 'Baked eggs with kale, tomatoes, and feta cheese.',
      dietaryTags: ['balanced', 'low-carb'],
    },
  ],
  lunch: [
    {
      id: 'ln-chicken-quinoa',
      name: 'Grilled chicken quinoa bowl',
      calories: 520,
      protein: 42,
      carbs: 50,
      fat: 16,
      description: 'Chicken breast, quinoa, roasted vegetables, and lemon tahini dressing.',
      dietaryTags: ['balanced', 'high-protein'],
    },
    {
      id: 'ln-lentil-salad',
      name: 'Mediterranean lentil salad',
      calories: 480,
      protein: 24,
      carbs: 60,
      fat: 16,
      description: 'Green lentils, cucumber, tomato, olives, and herbed vinaigrette.',
      dietaryTags: ['balanced', 'vegetarian', 'vegan'],
    },
    {
      id: 'ln-salmon-bowl',
      name: 'Miso salmon nourish bowl',
      calories: 510,
      protein: 38,
      carbs: 42,
      fat: 20,
      description: 'Baked salmon, brown rice, edamame, and miso-ginger glaze.',
      dietaryTags: ['balanced', 'pescatarian', 'high-protein'],
    },
    {
      id: 'ln-zoodle-bolognese',
      name: 'Turkey zoodle bolognese',
      calories: 470,
      protein: 40,
      carbs: 28,
      fat: 18,
      description: 'Lean turkey simmered in marinara over zucchini noodles.',
      dietaryTags: ['balanced', 'low-carb', 'high-protein'],
    },
  ],
  dinner: [
    {
      id: 'dn-turkey-lettuce-wraps',
      name: 'Turkey lettuce wraps',
      calories: 480,
      protein: 42,
      carbs: 30,
      fat: 18,
      description: 'Ground turkey with water chestnuts and hoisin sauce in lettuce cups.',
      dietaryTags: ['balanced', 'low-carb', 'high-protein'],
    },
    {
      id: 'dn-chickpea-curry',
      name: 'Coconut chickpea curry',
      calories: 520,
      protein: 20,
      carbs: 58,
      fat: 22,
      description: 'Chickpeas simmered in coconut curry with spinach over cauliflower rice.',
      dietaryTags: ['balanced', 'vegetarian', 'vegan'],
    },
    {
      id: 'dn-salmon-sheet-pan',
      name: 'Herb roasted salmon & veggies',
      calories: 500,
      protein: 40,
      carbs: 32,
      fat: 22,
      description: 'Sheet-pan salmon with asparagus, baby potatoes, and herb oil.',
      dietaryTags: ['balanced', 'pescatarian', 'high-protein'],
    },
    {
      id: 'dn-tofu-stirfry',
      name: 'Sesame tofu stir-fry',
      calories: 480,
      protein: 26,
      carbs: 46,
      fat: 18,
      description: 'Tofu stir-fried with broccoli, snap peas, and brown rice.',
      dietaryTags: ['balanced', 'vegetarian', 'vegan'],
    },
  ],
  snack: [
    {
      id: 'sn-apple-almond',
      name: 'Apple & almond butter',
      calories: 220,
      protein: 6,
      carbs: 24,
      fat: 12,
      description: 'Sliced apple with almond butter and cinnamon.',
      dietaryTags: ['balanced', 'vegetarian', 'vegan'],
    },
    {
      id: 'sn-protein-smoothie',
      name: 'Berry protein smoothie',
      calories: 250,
      protein: 24,
      carbs: 22,
      fat: 8,
      description: 'Plant protein blended with berries, spinach, and flax.',
      dietaryTags: ['balanced', 'vegetarian', 'vegan', 'high-protein'],
    },
    {
      id: 'sn-hummus-veggies',
      name: 'Hummus & veggie plate',
      calories: 210,
      protein: 8,
      carbs: 26,
      fat: 9,
      description: 'Roasted red pepper hummus with carrots and cucumbers.',
      dietaryTags: ['balanced', 'vegetarian', 'vegan'],
    },
    {
      id: 'sn-eggs',
      name: 'Soft boiled eggs & greens',
      calories: 190,
      protein: 16,
      carbs: 6,
      fat: 10,
      description: 'Two soft-boiled eggs with cherry tomatoes and arugula.',
      dietaryTags: ['balanced', 'high-protein', 'low-carb'],
    },
  ],
};

export function isOptionCompatible(option: MealOption, preference: DietaryPreference) {
  if (preference === 'balanced') {
    return true;
  }
  if (preference === 'vegetarian') {
    return option.dietaryTags.includes('vegetarian') || option.dietaryTags.includes('vegan');
  }
  if (preference === 'vegan') {
    return option.dietaryTags.includes('vegan');
  }
  if (preference === 'pescatarian') {
    return (
      option.dietaryTags.includes('pescatarian') ||
      option.dietaryTags.includes('vegetarian') ||
      option.dietaryTags.includes('vegan')
    );
  }
  if (preference === 'high-protein') {
    return option.dietaryTags.includes('high-protein');
  }
  if (preference === 'low-carb') {
    return option.dietaryTags.includes('low-carb') || option.dietaryTags.includes('high-protein');
  }
  return true;
}

export const GOAL_INTENSITY: Array<{
  value: 'mild' | 'moderate' | 'aggressive';
  label: string;
  calorieAdjustment: number;
  description: string;
}> = [
  {
    value: 'mild',
    label: 'Mild (-300 kcal)',
    calorieAdjustment: -300,
    description: 'Slow and steady deficit for consistent progress.',
  },
  {
    value: 'moderate',
    label: 'Moderate (-500 kcal)',
    calorieAdjustment: -500,
    description: 'Balanced approach that fits most people.',
  },
  {
    value: 'aggressive',
    label: 'Accelerated (-750 kcal)',
    calorieAdjustment: -750,
    description: 'Use temporarily and monitor energy levels closely.',
  },
];
