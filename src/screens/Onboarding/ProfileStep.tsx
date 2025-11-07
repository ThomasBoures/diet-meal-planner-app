import { ScrollView, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { Control } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { NumberField } from '../../components/Form/NumberField';
import { SelectField } from '../../components/Form/SelectField';
import { TextField } from '../../components/Form/TextField';
import type { ProfileFormValues } from '../../utils/validation';

export type ProfileStepProps = {
  control: Control<ProfileFormValues>;
  onNext: () => void;
};

const ProfileStep = ({ control, onNext }: ProfileStepProps) => {
  const { t } = useTranslation();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineMedium">{t('onboarding.profile_title')}</Text>
      <TextField control={control} name="name" label={t('onboarding.name')} />
      <SelectField
        control={control}
        name="sex"
        label={t('onboarding.sex')}
        options={['male', 'female', 'other'].map(value => ({ label: t(`onboarding.sex_options.${value}`), value }))}
      />
      <NumberField control={control} name="age" label={t('onboarding.age')} suffix="ans" />
      <NumberField control={control} name="heightCm" label={t('onboarding.height')} suffix="cm" />
      <NumberField control={control} name="weightKg" label={t('onboarding.weight')} suffix="kg" />
      <Button mode="contained" onPress={onNext} accessibilityLabel={t('onboarding.goals_title')}>
        {t('onboarding.goals_title')}
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
});

export default ProfileStep;
