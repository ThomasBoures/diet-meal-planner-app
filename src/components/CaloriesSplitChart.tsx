import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import type { MealKey } from '../stores/plannerStore';
import { formatPercentage } from '../utils/format';

export type CaloriesSplit = Record<MealKey, number>;

type CaloriesSplitChartProps = {
  split: CaloriesSplit;
};

const labels: Record<MealKey, string> = {
  snack: 'Snack',
  breakfast: 'Petit-déjeuner',
  lunch: 'Déjeuner',
  dinner: 'Dîner',
};

export const CaloriesSplitChart = ({ split }: CaloriesSplitChartProps) => {
  const total = Object.values(split).reduce((acc, value) => acc + value, 0);
  return (
    <View style={styles.container} accessibilityLabel="Répartition calorique par repas">
      {Object.entries(split).map(([key, value]) => {
        const pct = total ? value / total : 0;
        return (
          <View key={key} style={styles.row}>
            <View style={[styles.bar, { flex: pct }]}> </View>
            <Text variant="bodyMedium" style={styles.label}>
              {labels[key as MealKey]} · {formatPercentage(pct)}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bar: {
    height: 8,
    borderRadius: 999,
    backgroundColor: '#1C7C54',
    flexGrow: 1,
  },
  label: {
    flexShrink: 0,
  },
});
