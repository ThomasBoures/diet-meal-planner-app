import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

import { formatNumber } from '../utils/format';

export type MacroTarget = {
  protein_g: number;
  carbs_g: number;
  fat_g: number;
};

type MacroBarProps = {
  totals: MacroTarget;
  targets?: MacroTarget;
};

const macroOrder: Array<{ key: keyof MacroTarget; color: string; label: string }> = [
  { key: 'protein_g', color: '#4CAF50', label: 'Protéines' },
  { key: 'carbs_g', color: '#2196F3', label: 'Glucides' },
  { key: 'fat_g', color: '#FF9800', label: 'Lipides' },
];

export const MacroBar = ({ totals, targets }: MacroBarProps) => {
  const theme = useTheme();
  const totalKcal =
    totals.protein_g * 4 + totals.carbs_g * 4 + totals.fat_g * 9;
  return (
    <View accessible accessibilityLabel="Répartition des macronutriments" style={styles.container}>
      <View style={styles.bar}>
        {macroOrder.map(({ key, color }) => {
          const weight = totals[key] * (key === 'fat_g' ? 9 : 4);
          const widthPct = totalKcal ? Math.max(5, (weight / totalKcal) * 100) : 0;
          return <View key={key} style={{ flexBasis: `${widthPct}%`, backgroundColor: color }} />;
        })}
      </View>
      <View style={styles.legend}>
        {macroOrder.map(({ key, color, label }) => {
          const value = totals[key];
          const target = targets?.[key];
          return (
            <View key={key} style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: color }]} />
              <Text variant="bodySmall" style={{ color: theme.colors.onSurface }}>
                {label}: {formatNumber(value, 0)} g
                {target ? ` / ${formatNumber(target, 0)} g` : ''}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  bar: {
    flexDirection: 'row',
    borderRadius: 999,
    overflow: 'hidden',
    height: 12,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
});
