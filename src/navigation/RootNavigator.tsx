import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import { storage } from '../services/storage';
import { useUserStore } from '../stores/userStore';
import DailyPlanScreen from '../screens/PlannerScreen/DailyPlanScreen';
import OnboardingFlow from '../screens/Onboarding/OnboardingFlow';
import MainTabs from './MainTabs';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const [bootstrapped, setBootstrapped] = useState(false);
  const hydrate = useUserStore(state => state.hydrate);
  const onboardingComplete = useUserStore(state => state.settings.onboardingComplete);
  const theme = useTheme();

  useEffect(() => {
    (async () => {
      const [profile, settings] = await Promise.all([
        storage.loadProfile(),
        storage.loadSettings(),
      ]);
      hydrate({ profile, settings });
      setBootstrapped(true);
    })();
  }, [hydrate]);

  if (!bootstrapped) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} accessibilityLabel="Chargement" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!onboardingComplete ? (
          <Stack.Screen name="Onboarding" component={OnboardingFlow} />
        ) : null}
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="DailyPlan" component={DailyPlanScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
