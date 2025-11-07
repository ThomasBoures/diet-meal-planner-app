import { StyleSheet, View } from 'react-native';
import { Button, Chip, Text, useTheme } from 'react-native-paper';

import type { MealTemplate } from '../stores/plannerStore';
import { formatKcal } from '../utils/format';

export type MealOptionCardProps = {
  template: MealTemplate;
  onSelect: (template: MealTemplate) => void;
  selected?: boolean;
};

export const MealOptionCard = ({ template, onSelect, selected }: MealOptionCardProps) => {
  const theme = useTheme();
  return (
    <View
      style={[styles.container, { borderColor: selected ? theme.colors.primary : theme.colors.outline }]}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text variant="titleMedium">{template.title}</Text>
          <Text variant="bodySmall" style={styles.subtext}>
            {formatKcal(template.kcal)} · {template.protein_g} g P · {template.carbs_g} g G ·{' '}
            {template.fat_g} g L
          </Text>
        </View>
        <Button mode={selected ? 'contained' : 'outlined'} onPress={() => onSelect(template)}>
          {selected ? 'Choisi' : 'Choisir'}
        </Button>
      </View>
      <View style={styles.tags}>
        {(template.labels ?? []).map(label => (
          <Chip key={label} compact accessibilityLabel={label}>
            {label}
          </Chip>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  subtext: {
    marginTop: 4,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
