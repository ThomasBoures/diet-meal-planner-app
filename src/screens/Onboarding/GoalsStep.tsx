import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { Control, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { SelectField } from '../../components/Form/SelectField';
import type { ProfileFormValues } from '../../utils/validation';
import { activityLevels, dietaryTags } from '../../utils/validation';

export type GoalsStepProps = {
  control: Control<ProfileFormValues>;
  onTogglePreference: (tag: string) => void;
  onNext: () => void;
};

const GoalsStep = ({ control, onTogglePreference, onNext }: GoalsStepProps) => {
  const { t } = useTranslation();
  const preferences = useWatch({ control, name: 'dietaryPreferences' }) ?? [];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineMedium">{t('onboarding.goals_title')}</Text>
      <SelectField
        control={control}
        name="activityLevel"
        label={t('onboarding.activity')}
        options={activityLevels.map(level => ({ label: t(`onboarding.activity_options.${level}`), value: level }))}
      />
      <SelectField
        control={control}
        name="goal"
        label={t('onboarding.goal')}
        options={['lose_weight', 'maintain'].map(goal => ({ label: t(`onboarding.goal_options.${goal}`), value: goal }))}
      />
      <View style={styles.preferences}>
        {dietaryTags.map(tag => (
          <Button
            key={tag}
            mode={preferences.includes(tag) ? 'contained-tonal' : 'outlined'}
            onPress={() => onTogglePreference(tag)}
          >
            {tag}
          </Button>
        ))}
      </View>
      <Button mode="contained" onPress={onNext} accessibilityLabel={t('onboarding.summary_title')}>
        {t('onboarding.summary_title')}
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  preferences: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});

export default GoalsStep;
