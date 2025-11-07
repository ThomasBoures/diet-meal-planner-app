import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';

import PlannerScreen from '../screens/PlannerScreen';
import { useUserStore } from '../stores/userStore';
import { usePlannerStore } from '../stores/plannerStore';

const profile = {
  name: 'Test User',
  sex: 'female' as const,
  age: 32,
  heightCm: 168,
  weightKg: 70,
  activityLevel: 'moderate' as const,
  goal: 'lose_weight' as const,
  dietaryPreferences: [],
  allergens: [],
};

describe('PlannerScreen integration', () => {
  beforeEach(() => {
    useUserStore.setState({ profile, settings: { ...useUserStore.getState().settings, onboardingComplete: true } });
    usePlannerStore.setState({ options: { snack: [], breakfast: [], lunch: [], dinner: [] }, selections: {} });
  });

  it('allows selecting meals and finalizing a plan', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <PlannerScreen />
      </NavigationContainer>,
    );

    await waitFor(() => expect(usePlannerStore.getState().options.snack.length).toBeGreaterThan(0));

    const planner = usePlannerStore.getState();
    (['snack', 'breakfast', 'lunch', 'dinner'] as const).forEach(meal => {
      const option = planner.options[meal][0];
      if (option) {
        planner.selectMeal(meal, option);
      }
    });

    const finalize = getByText('Finaliser mon plan');
    fireEvent.press(finalize);

    await waitFor(() => {
      const plan = usePlannerStore.getState().lastPlan;
      expect(plan).toBeDefined();
      expect(plan?.totals.kcal).toBeGreaterThan(0);
    });
  });
});
