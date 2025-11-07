import AsyncStorage from '@react-native-async-storage/async-storage';

const PROFILE_KEY = 'dmp_profile';
const SETTINGS_KEY = 'dmp_settings';
const PLAN_KEY = 'dmp_plan';

export const storage = {
  async saveProfile(profile: unknown) {
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  },
  async loadProfile<T>() {
    const raw = await AsyncStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as T) : undefined;
  },
  async saveSettings(settings: unknown) {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  },
  async loadSettings<T>() {
    const raw = await AsyncStorage.getItem(SETTINGS_KEY);
    return raw ? (JSON.parse(raw) as T) : undefined;
  },
  async savePlan(plan: unknown) {
    await AsyncStorage.setItem(PLAN_KEY, JSON.stringify(plan));
  },
  async loadPlan<T>() {
    const raw = await AsyncStorage.getItem(PLAN_KEY);
    return raw ? (JSON.parse(raw) as T) : undefined;
  },
  async clearAll() {
    await AsyncStorage.multiRemove([PROFILE_KEY, SETTINGS_KEY, PLAN_KEY]);
  },
};
