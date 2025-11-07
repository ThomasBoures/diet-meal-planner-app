import { useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  ACTIVITY_LEVELS,
  CALORIE_SPLIT,
  DIETARY_PREFERENCE_LABELS,
  GOAL_INTENSITY,
  MEAL_CATEGORY_LABELS,
  MEAL_LIBRARY,
  MealCategory,
  MealOption,
  type ActivityLevel,
  type DietaryPreference,
  isOptionCompatible,
} from '@/constants/meal-data';

const MEAL_ORDER: MealCategory[] = ['breakfast', 'lunch', 'dinner', 'snack'];

type Gender = 'male' | 'female';

type GoalIntensity = (typeof GOAL_INTENSITY)[number]['value'];

type MealSelections = Record<MealCategory, MealOption | null>;

const INITIAL_SELECTIONS: MealSelections = {
  breakfast: null,
  lunch: null,
  dinner: null,
  snack: null,
};

function getBmiCategory(bmi: number) {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Healthy';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

function formatNumber(value: number, fractionDigits = 0) {
  return Number.isFinite(value) ? value.toFixed(fractionDigits) : '—';
}

type InputFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric';
  suffix?: string;
  borderColor: string;
  backgroundColor: string;
  textColor: string;
  placeholderColor: string;
};

function LabeledInput({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  suffix,
  borderColor,
  backgroundColor,
  textColor,
  placeholderColor,
}: InputFieldProps) {
  return (
    <View style={styles.inputContainer}>
      <ThemedText style={styles.inputLabel}>{label}</ThemedText>
      <View style={[styles.inputWrapper, { borderColor, backgroundColor }]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          keyboardType={keyboardType}
          placeholderTextColor={placeholderColor}
          style={[styles.textInput, { color: textColor }]}
        />
        {suffix ? (
          <ThemedText style={[styles.inputSuffix, { color: textColor }]}>{suffix}</ThemedText>
        ) : null}
      </View>
    </View>
  );
}

type OptionPillProps = {
  label: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
  borderColor: string;
  backgroundColor: string;
  selectedBorderColor: string;
  selectedBackgroundColor: string;
  accentColor: string;
  mutedColor: string;
};

function OptionPill({
  label,
  description,
  selected,
  onPress,
  borderColor,
  backgroundColor,
  selectedBorderColor,
  selectedBackgroundColor,
  accentColor,
  mutedColor,
}: OptionPillProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.optionPill,
        { borderColor, backgroundColor },
        selected && {
          borderColor: selectedBorderColor,
          backgroundColor: selectedBackgroundColor,
        },
        pressed && styles.optionPillPressed,
      ]}>
      <ThemedText style={[styles.optionPillLabel, selected && { color: accentColor }]}>
        {label}
      </ThemedText>
      {description ? (
        <ThemedText
          style={[styles.optionPillDescription, { color: mutedColor }, selected && { color: accentColor }]}
        >
          {description}
        </ThemedText>
      ) : null}
    </Pressable>
  );
}

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];
  const surfaceColor = colorScheme === 'dark' ? 'rgba(30,36,42,0.92)' : 'rgba(255,255,255,0.95)';
  const surfaceSoftColor = colorScheme === 'dark' ? 'rgba(24,29,35,0.9)' : 'rgba(255,255,255,0.85)';
  const borderColor = colorScheme === 'dark' ? '#2d3a44' : '#d0d7de';
  const placeholderColor = colorScheme === 'dark' ? '#96A2AE' : '#8E9BA8';
  const accentColor = palette.tint;
  const mutedTextColor = colorScheme === 'dark' ? '#a5b3bf' : '#5a6570';
  const selectedSurface = colorScheme === 'dark' ? 'rgba(10,126,164,0.24)' : 'rgba(10,126,164,0.1)';
  const heroBackground = colorScheme === 'dark' ? '#0a5167' : '#0a7ea4';

  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender>('female');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('lightly-active');
  const [dietaryPreference, setDietaryPreference] = useState<DietaryPreference>('balanced');
  const [goalIntensity, setGoalIntensity] = useState<GoalIntensity>('moderate');
  const [selectedMeals, setSelectedMeals] = useState<MealSelections>(INITIAL_SELECTIONS);

  const numericAge = Number(age);
  const numericHeight = Number(height);
  const numericWeight = Number(weight);

  const metricsReady = Boolean(
    name.trim() &&
      numericAge > 0 &&
      numericHeight > 0 &&
      numericWeight > 0 &&
      Number.isFinite(numericAge) &&
      Number.isFinite(numericHeight) &&
      Number.isFinite(numericWeight),
  );

  useEffect(() => {
    setSelectedMeals((previous) => {
      const updated: MealSelections = { ...previous };
      MEAL_ORDER.forEach((category) => {
        const current = previous[category];
        if (current && !isOptionCompatible(current, dietaryPreference)) {
          updated[category] = null;
        }
      });
      return updated;
    });
  }, [dietaryPreference]);

  const calculations = useMemo(() => {
    if (!metricsReady) {
      return {
        bmi: NaN,
        bmr: NaN,
        tdee: NaN,
        calorieTarget: NaN,
        goalAdjustment: 0,
        activityFactor: 1,
      };
    }

    const heightMeters = numericHeight / 100;
    const bmi = numericWeight / (heightMeters * heightMeters);
    const genderConstant = gender === 'male' ? 5 : -161;
    const bmr = 10 * numericWeight + 6.25 * numericHeight - 5 * numericAge + genderConstant;
    const activityFactor = ACTIVITY_LEVELS.find((level) => level.value === activityLevel)?.factor ?? 1.2;
    const tdee = bmr * activityFactor;
    const goalConfig = GOAL_INTENSITY.find((goal) => goal.value === goalIntensity);
    const goalAdjustment = goalConfig?.calorieAdjustment ?? -500;
    const calorieTarget = Math.max(1200, Math.round((tdee + goalAdjustment) / 10) * 10);

    return { bmi, bmr, tdee, calorieTarget, goalAdjustment, activityFactor };
  }, [metricsReady, numericHeight, numericWeight, numericAge, gender, activityLevel, goalIntensity]);

  const bmiCategory = Number.isFinite(calculations.bmi) ? getBmiCategory(calculations.bmi) : null;
  const needsWeightLoss = Number.isFinite(calculations.bmi) ? calculations.bmi >= 25 : false;
  const displayName = name.trim().split(' ')[0] || 'there';

  const selectedTotals = useMemo(() => {
    return MEAL_ORDER.reduce(
      (totals, category) => {
        const meal = selectedMeals[category];
        if (!meal) {
          return totals;
        }
        return {
          calories: totals.calories + meal.calories,
          protein: totals.protein + meal.protein,
          carbs: totals.carbs + meal.carbs,
          fat: totals.fat + meal.fat,
        };
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    );
  }, [selectedMeals]);

  const allMealsSelected = MEAL_ORDER.every((category) => selectedMeals[category]);

  const calorieDelta = Number.isFinite(calculations.calorieTarget)
    ? selectedTotals.calories - calculations.calorieTarget
    : NaN;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ ios: 'padding', android: undefined })}>
      <ScrollView contentContainerStyle={styles.container}>
        <ThemedView style={[styles.heroCard, { backgroundColor: heroBackground }]}>
          <ThemedText type="title" style={styles.heroTitle}>
            Personalized Meal Planner
          </ThemedText>
          <ThemedText style={styles.heroSubtitle}>
            Enter your health stats to receive calorie targets, then mix and match meal options to build a daily plan tailored to
            your goals.
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.card}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Tell us about you
          </ThemedText>
          <LabeledInput
            label="Name"
            value={name}
            onChangeText={setName}
            placeholder="e.g. Jordan"
            borderColor={borderColor}
            backgroundColor={surfaceSoftColor}
            textColor={palette.text}
            placeholderColor={placeholderColor}
          />
          <ThemedText style={styles.inputLabel}>Gender</ThemedText>
          <View style={styles.optionRow}>
            {(['female', 'male'] as Gender[]).map((option) => (
              <OptionPill
                key={option}
                label={option === 'female' ? 'Female' : 'Male'}
                selected={gender === option}
                onPress={() => setGender(option)}
                borderColor={borderColor}
                backgroundColor={surfaceColor}
                selectedBorderColor={accentColor}
                selectedBackgroundColor={selectedSurface}
                accentColor={accentColor}
                mutedColor={mutedTextColor}
              />
            ))}
          </View>
          <View style={styles.inputRow}>
            <LabeledInput
              label="Age"
              value={age}
              onChangeText={setAge}
              placeholder="Years"
              keyboardType="numeric"
              borderColor={borderColor}
              backgroundColor={surfaceSoftColor}
              textColor={palette.text}
              placeholderColor={placeholderColor}
            />
            <LabeledInput
              label="Height"
              value={height}
              onChangeText={setHeight}
              placeholder="cm"
              keyboardType="numeric"
              suffix="cm"
              borderColor={borderColor}
              backgroundColor={surfaceSoftColor}
              textColor={palette.text}
              placeholderColor={placeholderColor}
            />
            <LabeledInput
              label="Weight"
              value={weight}
              onChangeText={setWeight}
              placeholder="kg"
              keyboardType="numeric"
              suffix="kg"
              borderColor={borderColor}
              backgroundColor={surfaceSoftColor}
              textColor={palette.text}
              placeholderColor={placeholderColor}
            />
          </View>

          <ThemedText style={styles.inputLabel}>Activity level</ThemedText>
          <View style={styles.optionColumn}>
            {ACTIVITY_LEVELS.map((level) => (
              <OptionPill
                key={level.value}
                label={level.label}
                description={level.description}
                selected={activityLevel === level.value}
                onPress={() => setActivityLevel(level.value)}
                borderColor={borderColor}
                backgroundColor={surfaceColor}
                selectedBorderColor={accentColor}
                selectedBackgroundColor={selectedSurface}
                accentColor={accentColor}
                mutedColor={mutedTextColor}
              />
            ))}
          </View>

          <ThemedText style={styles.inputLabel}>Preferred eating style</ThemedText>
          <View style={styles.optionRowWrap}>
            {(Object.keys(DIETARY_PREFERENCE_LABELS) as DietaryPreference[]).map((preference) => (
              <OptionPill
                key={preference}
                label={DIETARY_PREFERENCE_LABELS[preference]}
                selected={dietaryPreference === preference}
                onPress={() => setDietaryPreference(preference)}
                borderColor={borderColor}
                backgroundColor={surfaceColor}
                selectedBorderColor={accentColor}
                selectedBackgroundColor={selectedSurface}
                accentColor={accentColor}
                mutedColor={mutedTextColor}
              />
            ))}
          </View>

          <ThemedText style={styles.inputLabel}>Calorie deficit pace</ThemedText>
          <View style={styles.optionColumn}>
            {GOAL_INTENSITY.map((option) => (
              <OptionPill
                key={option.value}
                label={option.label}
                description={option.description}
                selected={goalIntensity === option.value}
                onPress={() => setGoalIntensity(option.value)}
                borderColor={borderColor}
                backgroundColor={surfaceColor}
                selectedBorderColor={accentColor}
                selectedBackgroundColor={selectedSurface}
                accentColor={accentColor}
                mutedColor={mutedTextColor}
              />
            ))}
          </View>
        </ThemedView>

        {metricsReady ? (
          <ThemedView style={styles.card}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Your metabolic snapshot
            </ThemedText>
            <View style={styles.metricsRow}>
              <View style={[styles.metricBox, { borderColor, backgroundColor: surfaceColor }]}>
                <ThemedText style={styles.metricLabel}>BMI</ThemedText>
                <ThemedText style={styles.metricValue}>{formatNumber(calculations.bmi, 1)}</ThemedText>
                <ThemedText style={[styles.metricCaption, { color: mutedTextColor }]}>
                  {bmiCategory ?? '—'}
                </ThemedText>
              </View>
              <View style={[styles.metricBox, { borderColor, backgroundColor: surfaceColor }]}>
                <ThemedText style={styles.metricLabel}>BMR</ThemedText>
                <ThemedText style={styles.metricValue}>{formatNumber(calculations.bmr)}</ThemedText>
                <ThemedText style={[styles.metricCaption, { color: mutedTextColor }]}>kcal / day</ThemedText>
              </View>
              <View style={[styles.metricBox, { borderColor, backgroundColor: surfaceColor }]}>
                <ThemedText style={styles.metricLabel}>TDEE</ThemedText>
                <ThemedText style={styles.metricValue}>{formatNumber(calculations.tdee)}</ThemedText>
                <ThemedText style={[styles.metricCaption, { color: mutedTextColor }]}>with activity</ThemedText>
              </View>
              <View style={[styles.metricBox, { borderColor, backgroundColor: surfaceColor }]}>
                <ThemedText style={styles.metricLabel}>Goal target</ThemedText>
                <ThemedText style={styles.metricValue}>{formatNumber(calculations.calorieTarget)}</ThemedText>
                <ThemedText style={[styles.metricCaption, { color: mutedTextColor }]}>daily calories</ThemedText>
              </View>
            </View>
            <ThemedText style={styles.guidanceText}>
              {needsWeightLoss
                ? `${displayName}, your BMI suggests focusing on fat loss. We've created a ${Math.abs(calculations.goalAdjustment)} kcal deficit target to guide your meals.`
                : `${displayName}, you're currently in the ${bmiCategory?.toLowerCase() ?? 'healthy'} range. Maintain your routine and focus on balanced, mindful eating.`}
            </ThemedText>
          </ThemedView>
        ) : (
          <ThemedView style={styles.card}>
            <ThemedText style={styles.guidanceText}>
              Provide all required details above to unlock personalized calorie guidance and curated meal ideas.
            </ThemedText>
          </ThemedView>
        )}

        {metricsReady && needsWeightLoss ? (
          <>
            <ThemedView style={styles.card}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Build your plan
              </ThemedText>
              <ThemedText style={styles.guidanceText}>
                Select one meal from each section. We&apos;ll keep track of calories and macros so you can stay close to your daily
                target of {formatNumber(calculations.calorieTarget)} kcal.
              </ThemedText>
            </ThemedView>

            {MEAL_ORDER.map((category) => {
              const targetCalories = Number.isFinite(calculations.calorieTarget)
                ? Math.round(calculations.calorieTarget * CALORIE_SPLIT[category])
                : NaN;
              const compatibleOptions = MEAL_LIBRARY[category].filter((option) =>
                isOptionCompatible(option, dietaryPreference),
              );
              return (
                <ThemedView key={category} style={styles.card}>
                  <View style={styles.mealHeader}>
                    <ThemedText type="subtitle" style={styles.mealTitle}>
                      {MEAL_CATEGORY_LABELS[category]}
                    </ThemedText>
                    <ThemedText style={[styles.mealTarget, { color: mutedTextColor }]}>
                      Target ≈ {Number.isFinite(targetCalories) ? `${targetCalories} kcal` : '—'}
                    </ThemedText>
                  </View>
                  {compatibleOptions.length === 0 ? (
                    <ThemedText style={styles.guidanceText}>
                      We don&apos;t yet have recipes for this preference. Try selecting a different eating style above.
                    </ThemedText>
                  ) : (
                    compatibleOptions.map((option) => {
                      const isSelected = selectedMeals[category]?.id === option.id;
                      return (
                        <Pressable
                          key={option.id}
                          onPress={() =>
                            setSelectedMeals((current) => ({
                              ...current,
                              [category]: option,
                            }))
                          }
                          style={({ pressed }) => [
                        styles.mealCard,
                        { borderColor, backgroundColor: surfaceColor },
                        isSelected && {
                          borderColor: accentColor,
                          backgroundColor: selectedSurface,
                        },
                        pressed && styles.mealCardPressed,
                      ]}>
                          <View style={styles.mealCardHeader}>
                            <ThemedText style={styles.mealName}>{option.name}</ThemedText>
                            <ThemedText style={[styles.mealCalories, { color: accentColor }]}>
                              {option.calories} kcal
                            </ThemedText>
                          </View>
                          <ThemedText style={[styles.mealDescription, { color: mutedTextColor }]}>
                            {option.description}
                          </ThemedText>
                          <View style={styles.mealMacrosRow}>
                            <ThemedText style={styles.mealMacro}>Protein {option.protein}g</ThemedText>
                            <ThemedText style={styles.mealMacro}>Carbs {option.carbs}g</ThemedText>
                            <ThemedText style={styles.mealMacro}>Fat {option.fat}g</ThemedText>
                          </View>
                        </Pressable>
                      );
                    })
                  )}
                </ThemedView>
              );
            })}

            <ThemedView style={styles.card}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Daily summary
              </ThemedText>
              {allMealsSelected ? (
                <>
                  <View style={styles.summaryRow}>
                    <View style={[styles.summaryColumn, { borderColor, backgroundColor: surfaceColor }]}>
                      <ThemedText style={[styles.summaryLabel, { color: mutedTextColor }]}>Calories</ThemedText>
                      <ThemedText style={styles.summaryValue}>{selectedTotals.calories} kcal</ThemedText>
                    </View>
                    <View style={[styles.summaryColumn, { borderColor, backgroundColor: surfaceColor }]}>
                      <ThemedText style={[styles.summaryLabel, { color: mutedTextColor }]}>Protein</ThemedText>
                      <ThemedText style={styles.summaryValue}>{selectedTotals.protein} g</ThemedText>
                    </View>
                    <View style={[styles.summaryColumn, { borderColor, backgroundColor: surfaceColor }]}>
                      <ThemedText style={[styles.summaryLabel, { color: mutedTextColor }]}>Carbs</ThemedText>
                      <ThemedText style={styles.summaryValue}>{selectedTotals.carbs} g</ThemedText>
                    </View>
                    <View style={[styles.summaryColumn, { borderColor, backgroundColor: surfaceColor }]}>
                      <ThemedText style={[styles.summaryLabel, { color: mutedTextColor }]}>Fat</ThemedText>
                      <ThemedText style={styles.summaryValue}>{selectedTotals.fat} g</ThemedText>
                    </View>
                  </View>
                  <ThemedText style={styles.summaryDelta}>
                    {Number.isFinite(calorieDelta)
                      ? calorieDelta === 0
                        ? 'Perfect! Your selections match the target calories.'
                        : calorieDelta > 0
                        ? `You are ${Math.abs(calorieDelta)} kcal above target. Swap an item or trim portions to tighten the deficit.`
                        : `You are ${Math.abs(calorieDelta)} kcal below target. Add a piece of fruit or extra healthy fats to stay fueled.`
                      : 'Calorie target unavailable. Review your personal details above.'}
                  </ThemedText>
                </>
              ) : (
                <ThemedText style={styles.guidanceText}>
                  Choose an option for breakfast, lunch, dinner, and snack to lock in your personalized plan.
                </ThemedText>
              )}
            </ThemedView>
          </>
        ) : metricsReady ? (
          <ThemedView style={styles.card}>
            <ThemedText style={styles.guidanceText}>
              Your metrics look great! Keep nourishing your body with balanced meals and stay active to maintain your progress.
            </ThemedText>
          </ThemedView>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 48,
    gap: 16,
  },
  heroCard: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#0a7ea4',
  },
  heroTitle: {
    color: '#fff',
    marginBottom: 8,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.92)',
    lineHeight: 22,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  sectionTitle: {
    marginBottom: 4,
  },
  inputContainer: {
    width: '100%',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputLabel: {
    fontWeight: '600',
    marginBottom: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: Platform.select({ ios: 12, default: 8 }),
  },
  textInput: {
    flex: 1,
    fontSize: 16,
  },
  inputSuffix: {
    marginLeft: 8,
    fontWeight: '600',
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionRowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionColumn: {
    flexDirection: 'column',
    gap: 12,
  },
  optionPill: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    maxWidth: '100%',
  },
  optionPillPressed: {
    opacity: 0.85,
  },
  optionPillLabel: {
    fontWeight: '600',
  },
  optionPillDescription: {
    marginTop: 2,
    fontSize: 13,
  },
  metricsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricBox: {
    flexGrow: 1,
    minWidth: 130,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  metricLabel: {
    fontWeight: '600',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  metricCaption: {
    marginTop: 2,
  },
  guidanceText: {
    lineHeight: 22,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealTitle: {
    flex: 1,
  },
  mealTarget: {
    fontSize: 14,
  },
  mealCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 8,
  },
  mealCardPressed: {
    opacity: 0.92,
  },
  mealCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  mealName: {
    flex: 1,
    fontWeight: '600',
  },
  mealCalories: {
    fontWeight: '700',
  },
  mealDescription: {
    lineHeight: 20,
  },
  mealMacrosRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  mealMacro: {
    fontSize: 14,
    fontWeight: '500',
  },
  summaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  summaryColumn: {
    flexGrow: 1,
    minWidth: 120,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 13,
    marginBottom: 6,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  summaryDelta: {
    marginTop: 12,
    lineHeight: 20,
  },
});
