import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, RadioButton, Text, TextInput } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

import { NumberField } from '../components/Form/NumberField';
import { SelectField } from '../components/Form/SelectField';
import { TextField } from '../components/Form/TextField';
import { MacroBar } from '../components/MacroBar';
import { bmi, bmiCategory } from '../services/calc/bmi';
import { bmrMifflinStJeor } from '../services/calc/bmr';
import { macroTargets } from '../services/calc/macros';
import { lossTarget } from '../services/calc/targetCalories';
import { tdee } from '../services/calc/tdee';
import { useUserStore } from '../stores/userStore';
import { activityLevels, dietaryTags, profileSchema, type ProfileFormValues } from '../utils/validation';
import { formatKcal, formatNumber } from '../utils/format';

const ProfileScreen = () => {
  const { t } = useTranslation();
  const profile = useUserStore(state => state.profile);
  const settings = useUserStore(state => state.settings);
  const setProfile = useUserStore(state => state.setProfile);
  const setSettings = useUserStore(state => state.setSettings);
  const resetApp = useUserStore(state => state.reset);

  const { control, handleSubmit, watch, setValue } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    mode: 'onChange',
    defaultValues: profile ?? {
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

  const watched = watch();
  const [mealSplit, setMealSplit] = useState(settings.mealSplit);
  const [macroSplit, setMacroSplit] = useState(settings.macroSplit);
  const [language, setLanguage] = useState(settings.language);
  const [theme, setTheme] = useState(settings.theme);

  const metrics = useMemo(() => {
    try {
      const bmiValue = bmi({ weightKg: watched.weightKg, heightCm: watched.heightCm });
      const bmrValue = bmrMifflinStJeor({
        sex: watched.sex,
        weightKg: watched.weightKg,
        heightCm: watched.heightCm,
        age: watched.age,
      });
      const tdeeValue = tdee({ bmr: bmrValue, level: watched.activityLevel });
      const target = watched.goal === 'maintain' ? tdeeValue : lossTarget({ tdee: tdeeValue, sex: watched.sex });
      const macros = macroTargets({ kcal: target, ...macroSplit });
      return { bmi: bmiValue, bmr: bmrValue, tdee: tdeeValue, target, macros };
    } catch (error) {
      return undefined;
    }
  }, [watched, macroSplit]);

  const onSubmit = handleSubmit(async values => {
    await setProfile({
      ...values,
      dietaryPreferences: values.dietaryPreferences ?? [],
      allergens: values.allergens ?? [],
    });
    await setSettings({
      mealSplit,
      macroSplit,
      language,
      theme,
      onboardingComplete: true,
    });
  });

  const updateSplit = (key: keyof typeof mealSplit, value: string) => {
    const normalized = Math.max(0, Math.min(100, Number(value) || 0)) / 100;
    setMealSplit(split => ({ ...split, [key]: normalized }));
  };

  const updateMacro = (key: keyof typeof macroSplit, value: string) => {
    const normalized = Math.max(0, Math.min(100, Number(value) || 0)) / 100;
    setMacroSplit(split => ({ ...split, [key]: normalized }));
  };

  const preferences = watched.dietaryPreferences ?? [];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineMedium">{t('profile.title')}</Text>
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
        <Text variant="titleMedium">{t('onboarding.preferences')}</Text>
        {dietaryTags.map(tag => (
          <Button
            key={tag}
            mode={preferences.includes(tag) ? 'contained-tonal' : 'outlined'}
            onPress={() => {
              const next = preferences.includes(tag)
                ? preferences.filter(item => item !== tag)
                : [...preferences, tag];
              setValue('dietaryPreferences', next);
            }}
          >
            {tag}
          </Button>
        ))}
      </View>
      <View style={styles.metrics}>
        {metrics ? (
          <>
            <Text>{`BMI: ${formatNumber(metrics.bmi, 1)} (${bmiCategory(metrics.bmi)})`}</Text>
            <Text>{`BMR: ${formatKcal(metrics.bmr)}`}</Text>
            <Text>{`TDEE: ${formatKcal(metrics.tdee)}`}</Text>
            <Text>{`Target: ${formatKcal(metrics.target)}`}</Text>
            <MacroBar totals={metrics.macros} />
          </>
        ) : (
          <Text>{t('planner.empty')}</Text>
        )}
      </View>
      <View style={styles.section}>
        <Text variant="titleMedium">{t('profile.language')}</Text>
        <RadioButton.Group onValueChange={setLanguage} value={language}>
          <RadioButton.Item label={t('settings.language.fr')} value="fr" />
          <RadioButton.Item label={t('settings.language.en')} value="en" />
        </RadioButton.Group>
      </View>
      <View style={styles.section}>
        <Text variant="titleMedium">{t('profile.theme')}</Text>
        <RadioButton.Group onValueChange={value => setTheme(value as typeof theme)} value={theme}>
          <RadioButton.Item label={t('settings.theme.light')} value="light" />
          <RadioButton.Item label={t('settings.theme.dark')} value="dark" />
          <RadioButton.Item label={t('settings.theme.system')} value="system" />
        </RadioButton.Group>
      </View>
      <View style={styles.section}>
        <Text variant="titleMedium">{t('profile.meal_split')}</Text>
        {(['snack', 'breakfast', 'lunch', 'dinner'] as const).map(key => (
          <TextInput
            key={key}
            label={key}
            value={String(Math.round(mealSplit[key] * 100))}
            onChangeText={value => updateSplit(key, value)}
            keyboardType="numeric"
            right={<TextInput.Affix text="%" />}
          />
        ))}
      </View>
      <View style={styles.section}>
        <Text variant="titleMedium">{t('profile.macro_split')}</Text>
        {(['protein', 'carbs', 'fat'] as const).map(key => (
          <TextInput
            key={key}
            label={key}
            value={String(Math.round(macroSplit[key] * 100))}
            onChangeText={value => updateMacro(key, value)}
            keyboardType="numeric"
            right={<TextInput.Affix text="%" />}
          />
        ))}
      </View>
      <Button mode="contained" onPress={onSubmit} accessibilityLabel={t('profile.save')}>
        {t('profile.save')}
      </Button>
      <Button mode="outlined" onPress={() => resetApp()} accessibilityLabel={t('profile.reset')}>
        {t('profile.reset')}
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
  metrics: {
    gap: 8,
  },
  section: {
    gap: 8,
  },
});

export default ProfileScreen;
