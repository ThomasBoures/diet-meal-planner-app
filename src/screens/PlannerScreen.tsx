import { useEffect, useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { MacroBar } from '../components/MacroBar';
import { MealOptionCard } from '../components/MealOptionCard';
import { splitByMeals, macroTargets } from '../services/calc/macros';
import { lossTarget } from '../services/calc/targetCalories';
import { bmrMifflinStJeor } from '../services/calc/bmr';
import { tdee } from '../services/calc/tdee';
import { usePlannerStore } from '../stores/plannerStore';
import { useUserStore } from '../stores/userStore';
import type { MealKey } from '../stores/plannerStore';
import { formatKcal } from '../utils/format';

const mealLabels: Record<MealKey, string> = {
  snack: 'Snack',
  breakfast: 'Petit-déjeuner',
  lunch: 'Déjeuner',
  dinner: 'Dîner',
};

const PlannerScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const profile = useUserStore(state => state.profile);
  const settings = useUserStore(state => state.settings);
  const generate = usePlannerStore(state => state.generate);
  const options = usePlannerStore(state => state.options);
  const selections = usePlannerStore(state => state.selections);
  const selectMeal = usePlannerStore(state => state.selectMeal);
  const finalize = usePlannerStore(state => state.finalize);

  const metrics = useMemo(() => {
    if (!profile) {
      return undefined;
    }
    const bmrValue = bmrMifflinStJeor({
      sex: profile.sex,
      weightKg: profile.weightKg,
      heightCm: profile.heightCm,
      age: profile.age,
    });
    const tdeeValue = tdee({ bmr: bmrValue, level: profile.activityLevel });
    const target = profile.goal === 'maintain' ? tdeeValue : lossTarget({ tdee: tdeeValue, sex: profile.sex });
    const macros = macroTargets({ kcal: target, ...settings.macroSplit });
    return { bmr: bmrValue, tdee: tdeeValue, target, macros };
  }, [profile, settings.macroSplit]);

  const mealTargets = useMemo(() => {
    if (!metrics) {
      return undefined;
    }
    return splitByMeals({ kcal: metrics.target, split: settings.mealSplit });
  }, [metrics, settings.mealSplit]);

  useEffect(() => {
    if (profile && mealTargets) {
      generate({ targets: mealTargets, profile });
    }
  }, [profile, mealTargets, generate]);

  const selectedCount = Object.keys(selections).length;

  const handleFinalize = async () => {
    const plan = await finalize();
    if (plan) {
      navigation.navigate('DailyPlan' as never);
    }
  };

  if (!profile || !metrics || !mealTargets) {
    return (
      <View style={styles.center}> 
        <Text>{t('planner.empty')}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View>
            <Text variant="headlineMedium">{t('planner.daily_target')}</Text>
            <Text variant="titleLarge">{formatKcal(metrics.target)}</Text>
          </View>
          <MacroBar totals={metrics.macros} />
        </View>
        {(['snack', 'breakfast', 'lunch', 'dinner'] as MealKey[]).map(meal => (
          <View key={meal}>
            <Text variant="titleMedium" accessibilityRole="header">
              {mealLabels[meal]} · {formatKcal(mealTargets[meal])}
            </Text>
            {(options[meal] ?? []).map(template => (
              <MealOptionCard
                key={template.id}
                template={template}
                selected={selections[meal]?.id === template.id}
                onSelect={selectMeal.bind(null, meal)}
              />
            ))}
          </View>
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <Text>{t('planner.select_count', { count: selectedCount })}</Text>
        <Button
          mode="contained"
          onPress={handleFinalize}
          disabled={selectedCount < 4}
          accessibilityLabel={t('planner.finalize')}
        >
          {t('planner.finalize')}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  header: {
    gap: 16,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#E0E0E0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
});

export default PlannerScreen;
