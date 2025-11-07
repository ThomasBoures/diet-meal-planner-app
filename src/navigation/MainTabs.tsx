import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'react-native-paper';

import HomeScreen from '../screens/HomeScreen';
import PlannerScreen from '../screens/PlannerScreen';
import FoodsScreen from '../screens/FoodsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import type { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

const iconMap: Record<keyof TabParamList, string> = {
  Home: 'home-heart',
  Planner: 'calendar-check',
  Foods: 'food-apple',
  Profile: 'account-circle',
};

const MainTabs = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name={iconMap[route.name as keyof TabParamList]} size={size} color={color} />
        ),
        tabBarActiveTintColor: theme.colors.primary,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: t('tabs.home') }} />
      <Tab.Screen name="Planner" component={PlannerScreen} options={{ title: t('tabs.planner') }} />
      <Tab.Screen name="Foods" component={FoodsScreen} options={{ title: t('tabs.foods') }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: t('tabs.profile') }} />
    </Tab.Navigator>
  );
};

export default MainTabs;
