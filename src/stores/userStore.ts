import { create } from 'zustand';

import type { ProfileFormValues, SettingsValues } from '../utils/validation';
import { storage } from '../services/storage';

export type UserProfile = ProfileFormValues;

export type UserSettings = SettingsValues & {
  onboardingComplete: boolean;
};

const defaultSettings: UserSettings = {
  language: 'fr',
  theme: 'system',
  mealSplit: {
    snack: 0.1,
    breakfast: 0.25,
    lunch: 0.35,
    dinner: 0.3,
  },
  macroSplit: {
    protein: 0.3,
    carbs: 0.4,
    fat: 0.3,
  },
  onboardingComplete: false,
};

type UserState = {
  profile?: UserProfile;
  settings: UserSettings;
  setProfile: (profile: UserProfile) => Promise<void>;
  setSettings: (settings: Partial<UserSettings>) => Promise<void>;
  reset: () => Promise<void>;
  hydrate: (data: { profile?: UserProfile; settings?: UserSettings }) => void;
};

export const useUserStore = create<UserState>((set, get) => ({
  profile: undefined,
  settings: defaultSettings,
  async setProfile(profile) {
    set({ profile });
    await storage.saveProfile(profile);
  },
  async setSettings(settings) {
    const next = { ...get().settings, ...settings };
    set({ settings: next });
    await storage.saveSettings(next);
  },
  async reset() {
    set({ profile: undefined, settings: defaultSettings });
    await storage.clearAll();
  },
  hydrate({ profile, settings }) {
    set({
      profile,
      settings: settings ?? defaultSettings,
    });
  },
}));

