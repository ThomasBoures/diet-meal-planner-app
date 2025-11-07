import { ScrollView, Share, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import { MacroBar } from '../../components/MacroBar';
import { usePlannerStore } from '../../stores/plannerStore';
import { formatKcal } from '../../utils/format';

const DailyPlanScreen = () => {
  const { t } = useTranslation();
  const lastPlan = usePlannerStore(state => state.lastPlan);
  const selections = lastPlan?.selections;
  const totals = lastPlan?.totals;

  const sharePlan = () => {
    if (!selections || !totals) {
      return;
    }
    const summary = Object.entries(selections)
      .map(([meal, template]) => `${meal.toUpperCase()} : ${template?.title}`)
      .join('\n');
    void Share.share({
      title: 'Plan repas',
      message: `${summary}\nTotal: ${formatKcal(totals.kcal)}`,
    });
  };

  if (!selections || !totals) {
    return (
      <View style={styles.center}>
        <Text>{t('planner.empty')}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineMedium">{t('planner.selected_plan')}</Text>
      {Object.entries(selections).map(([meal, template]) => (
        <View key={meal} style={styles.section}>
          <Text variant="titleMedium">{template?.title}</Text>
          <Text variant="bodySmall">
            {formatKcal(template?.kcal ?? 0)} · {template?.protein_g ?? 0} g P · {template?.carbs_g ?? 0} g G ·{' '}
            {template?.fat_g ?? 0} g L
          </Text>
        </View>
      ))}
      <View style={styles.section}>
        <Text variant="titleLarge">{formatKcal(totals.kcal)}</Text>
        <MacroBar totals={totals} />
      </View>
      <Button mode="contained" onPress={sharePlan} accessibilityLabel={t('planner.share')}>
        {t('planner.share')}
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  section: {
    gap: 8,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
});

export default DailyPlanScreen;
