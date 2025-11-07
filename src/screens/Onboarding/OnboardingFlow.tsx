import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import WelcomeStep from './WelcomeStep';
import ProfileStep from './ProfileStep';
import GoalsStep from './GoalsStep';
import SummaryStep from './SummaryStep';
import { profileSchema, type ProfileFormValues } from '../../utils/validation';
import { useUserStore } from '../../stores/userStore';

const OnboardingFlow = () => {
  const [step, setStep] = useState(0);
  const setProfile = useUserStore(state => state.setProfile);
  const setSettings = useUserStore(state => state.setSettings);

  const { control, setValue, getValues } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      sex: 'female',
      age: 25,
      heightCm: 165,
      weightKg: 65,
      activityLevel: 'moderate',
      goal: 'lose_weight',
      dietaryPreferences: [],
      allergens: [],
    },
  });

  const handleComplete = async () => {
    const values = getValues();
    await setProfile({ ...values, dietaryPreferences: values.dietaryPreferences ?? [], allergens: values.allergens ?? [] });
    await setSettings({ onboardingComplete: true });
  };

  return (
    <View style={styles.container}>
      {step === 0 && <WelcomeStep onNext={() => setStep(1)} />}
      {step === 1 && <ProfileStep control={control} onNext={() => setStep(2)} />}
      {step === 2 && (
        <GoalsStep
          control={control}
          onTogglePreference={tag => {
            const current = getValues('dietaryPreferences') ?? [];
            const next = current.includes(tag)
              ? current.filter(item => item !== tag)
              : [...current, tag];
            setValue('dietaryPreferences', next);
          }}
          onNext={() => setStep(3)}
        />
      )}
      {step === 3 && <SummaryStep values={getValues()} onComplete={handleComplete} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default OnboardingFlow;
