import { create } from 'zustand';

import foodsData from '../data/foods.json';

export type FoodItem = {
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

type FoodsState = {
  items: FoodItem[];
  query: string;
  filtered: FoodItem[];
  setQuery: (value: string) => void;
  addCustom: (item: FoodItem) => void;
};

const normalize = (value: string) => value.trim().toLowerCase();

export const useFoodsStore = create<FoodsState>((set, get) => ({
  items: foodsData as FoodItem[],
  query: '',
  filtered: foodsData as FoodItem[],
  setQuery(value) {
    const normalized = normalize(value);
    const filtered = (get().items as FoodItem[]).filter(item =>
      item.name.toLowerCase().includes(normalized) ||
      item.tags.some(tag => tag.toLowerCase().includes(normalized)),
    );
    set({ query: value, filtered });
  },
  addCustom(item) {
    set(state => ({ items: [...state.items, item], filtered: [...state.filtered, item] }));
  },
}));
