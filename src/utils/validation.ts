import { z } from 'zod';

export const activityLevels = ['sedentary', 'light', 'moderate', 'high', 'very_high'] as const;

export const dietaryTags = [
  'vegetarian',
  'vegan',
  'gluten_free',
  'dairy_free',
  'no_pork',
  'no_beef',
  'no_seafood',
] as const;

export const profileSchema = z.object({
  name: z.string().min(2).max(100),
  sex: z.enum(['male', 'female', 'other']),
  age: z.number().int().min(16).max(90),
  heightCm: z.number().min(120).max(220),
  weightKg: z.number().min(40).max(250),
  activityLevel: z.enum(activityLevels),
  goal: z.enum(['lose_weight', 'maintain']),
  dietaryPreferences: z.array(z.enum(dietaryTags)).optional(),
  allergens: z.array(z.string()).optional(),
});

export const settingsSchema = z.object({
  language: z.enum(['fr', 'en']),
  theme: z.enum(['light', 'dark', 'system']),
  mealSplit: z.object({
    snack: z.number().min(0).max(1),
    breakfast: z.number().min(0).max(1),
    lunch: z.number().min(0).max(1),
    dinner: z.number().min(0).max(1),
  }),
  macroSplit: z.object({
    protein: z.number().min(0).max(1),
    carbs: z.number().min(0).max(1),
    fat: z.number().min(0).max(1),
  }),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
export type SettingsValues = z.infer<typeof settingsSchema>;
