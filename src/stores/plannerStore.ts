import { create } from 'zustand';

import foodsData from '../data/foods.json';
import mealTemplates from '../data/mealTemplates.json';
import { storage } from '../services/storage';
import type { UserProfile } from './userStore';

export type MealKey = 'snack' | 'breakfast' | 'lunch' | 'dinner';

export type MealTemplate = {
  id: string;
  mealType: MealKey;
  title: string;
  items: string[];
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  tags?: string[];
  labels?: string[];
};

type TemplateMap = Record<MealKey, MealTemplate[]>;

const mealTemplateData = mealTemplates as MealTemplate[];

export type MealSelection = Partial<Record<MealKey, MealTemplate>>;

type DailyTotals = {
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
};

type PlannerState = {
  options: TemplateMap;
  selections: MealSelection;
  lastPlan?: { selections: MealSelection; totals: DailyTotals };
  generate: (params: {
    targets: Record<MealKey, number>;
    profile: UserProfile;
  }) => void;
  selectMeal: (meal: MealKey, template: MealTemplate) => void;
  clearSelection: () => void;
  finalize: () => Promise<{ selections: MealSelection; totals: DailyTotals } | undefined>;
};

type FoodItem = {
  id: string;
  mealType: string;
  name: string;
  portion_g: number;
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  tags: string[];
  allergens: string[];
  source: string;
};

const foodsMap = new Map((foodsData as FoodItem[]).map(item => [item.id, item]));

const filterByPreferences = (
  template: MealTemplate,
  profile: UserProfile,
): boolean => {
  const allergens = new Set<string>();
  template.items.forEach(id => {
    const food = foodsMap.get(id);
    if (food) {
      food.allergens.forEach(allergen => allergens.add(allergen));
    }
  });

  if (profile.allergens?.some(allergen => allergens.has(allergen))) {
    return false;
  }

  const prefs = profile.dietaryPreferences ?? [];

  if (prefs.includes('vegan')) {
    if (!template.tags?.includes('vegan')) {
      return false;
    }
  }

  if (prefs.includes('vegetarian')) {
    if (!(template.tags?.includes('vegetarian') || template.tags?.includes('vegan'))) {
      return false;
    }
  }

  if (prefs.includes('gluten_free') && allergens.has('gluten')) {
    return false;
  }

  if (prefs.includes('dairy_free') && allergens.has('dairy')) {
    return false;
  }

  if (prefs.includes('no_seafood') && (allergens.has('fish') || allergens.has('shellfish'))) {
    return false;
  }

  if (prefs.includes('no_pork') && template.title.toLowerCase().includes('porc')) {
    return false;
  }

  if (prefs.includes('no_beef') && template.title.toLowerCase().includes('bœuf')) {
    return false;
  }

  return true;
};

const groupByMeal = (templates: MealTemplate[]) =>
  templates.reduce<TemplateMap>((acc, template) => {
    if (!acc[template.mealType]) {
      acc[template.mealType] = [];
    }
    acc[template.mealType].push(template);
    return acc;
  }, { snack: [], breakfast: [], lunch: [], dinner: [] });

const sumMacros = (selection: MealSelection): DailyTotals => {
  return Object.values(selection).reduce((acc, template) => {
    if (!template) {
      return acc;
    }
    return {
      kcal: acc.kcal + template.kcal,
      protein_g: acc.protein_g + template.protein_g,
      carbs_g: acc.carbs_g + template.carbs_g,
      fat_g: acc.fat_g + template.fat_g,
    };
  }, { kcal: 0, protein_g: 0, carbs_g: 0, fat_g: 0 });
};

export const usePlannerStore = create<PlannerState>((set, get) => ({
  options: { snack: [], breakfast: [], lunch: [], dinner: [] },
  selections: {},
  generate({ targets, profile }) {
    const filtered = mealTemplateData.filter(template => filterByPreferences(template, profile));

    const grouped = groupByMeal(filtered);
    const options = Object.entries(grouped).reduce<TemplateMap>((acc, [mealKey, templates]) => {
      const target = targets[mealKey as MealKey];
      const sorted = templates
        .filter(template => {
          const diff = Math.abs(template.kcal - target);
          return diff <= target * 0.1;
        })
        .sort((a, b) => Math.abs(a.kcal - target) - Math.abs(b.kcal - target));

      const limited = sorted.length >= 3 ? sorted.slice(0, 5) : templates.slice(0, 5);

      acc[mealKey as MealKey] = limited;
      return acc;
    }, { snack: [], breakfast: [], lunch: [], dinner: [] });

    set({ options, selections: {}, lastPlan: undefined });
  },
  selectMeal(meal, template) {
    set(state => ({ selections: { ...state.selections, [meal]: template } }));
  },
  clearSelection() {
    set({ selections: {}, lastPlan: undefined });
  },
  async finalize() {
    const selections = get().selections;
    const totals = sumMacros(selections);
    if (Object.keys(selections).length < 4) {
      return undefined;
    }
    await storage.savePlan({ selections, totals });
    set({ lastPlan: { selections, totals } });
    return { selections, totals };
  },
}));
