import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import type { ProfileFormValues } from '../../utils/validation';
import { bmi, bmiCategory } from '../../services/calc/bmi';
import { bmrMifflinStJeor } from '../../services/calc/bmr';
import { tdee } from '../../services/calc/tdee';
import { lossTarget } from '../../services/calc/targetCalories';
import { formatKcal, formatNumber } from '../../utils/format';

export type SummaryStepProps = {
  values: ProfileFormValues;
  onComplete: () => void;
};

const SummaryStep = ({ values, onComplete }: SummaryStepProps) => {
  const { t } = useTranslation();
  const bmiValue = bmi({ weightKg: values.weightKg, heightCm: values.heightCm });
  const bmrValue = bmrMifflinStJeor({
    sex: values.sex,
    weightKg: values.weightKg,
    heightCm: values.heightCm,
    age: values.age,
  });
  const tdeeValue = tdee({ bmr: bmrValue, level: values.activityLevel });
  const target = values.goal === 'maintain' ? tdeeValue : lossTarget({ tdee: tdeeValue, sex: values.sex });

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">{t('onboarding.summary_title')}</Text>
      <Text>{`BMI: ${formatNumber(bmiValue, 1)} (${bmiCategory(bmiValue)})`}</Text>
      <Text>{`BMR: ${formatKcal(bmrValue)}`}</Text>
      <Text>{`TDEE: ${formatKcal(tdeeValue)}`}</Text>
      <Text>{`Target: ${formatKcal(target)}`}</Text>
      <Button mode="contained" onPress={onComplete} accessibilityLabel={t('onboarding.complete')}>
        {t('onboarding.complete')}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
});

export default SummaryStep;
