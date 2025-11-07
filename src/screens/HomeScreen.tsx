import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { Card } from '../components/Card';
import { MacroBar } from '../components/MacroBar';
import { bmi, bmiCategory } from '../services/calc/bmi';
import { bmrMifflinStJeor } from '../services/calc/bmr';
import { macroTargets } from '../services/calc/macros';
import { lossTarget } from '../services/calc/targetCalories';
import { tdee } from '../services/calc/tdee';
import { useUserStore } from '../stores/userStore';
import { formatKcal, formatNumber } from '../utils/format';

const sparklineData = [1800, 1900, 1750, 2000, 1850, 1950, 1880];

const HomeScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const profile = useUserStore(state => state.profile);
  const settings = useUserStore(state => state.settings);

  const metrics = useMemo(() => {
    if (!profile) {
      return undefined;
    }
    const bmiValue = bmi({ weightKg: profile.weightKg, heightCm: profile.heightCm });
    const bmrValue = bmrMifflinStJeor({
      sex: profile.sex,
      weightKg: profile.weightKg,
      heightCm: profile.heightCm,
      age: profile.age,
    });
    const tdeeValue = tdee({ bmr: bmrValue, level: profile.activityLevel });
    const target = profile.goal === 'maintain' ? tdeeValue : lossTarget({ tdee: tdeeValue, sex: profile.sex });
    const macros = macroTargets({ kcal: target, ...settings.macroSplit });
    return {
      bmi: bmiValue,
      bmiCategory: bmiCategory(bmiValue),
      bmr: bmrValue,
      tdee: tdeeValue,
      target,
      macros,
    };
  }, [profile, settings.macroSplit]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card title={t('home.bmi')}>
        {metrics ? (
          <View>
            <Text variant="displaySmall">{formatNumber(metrics.bmi, 1)}</Text>
            <Text variant="bodyMedium">
              {metrics.bmiCategory === 'under'
                ? 'Insuffisance pondérale'
                : metrics.bmiCategory === 'normal'
                  ? 'Corpulence normale'
                  : metrics.bmiCategory === 'over'
                    ? 'Surpoids'
                    : 'Obésité'}
            </Text>
          </View>
        ) : (
          <Text>{t('planner.empty')}</Text>
        )}
      </Card>
      <Card title={t('home.target')}>
        {metrics ? (
          <View style={styles.metricRow}>
            <View>
              <Text variant="headlineMedium">{formatKcal(metrics.target)}</Text>
              <Text variant="bodySmall">{t('home.bmr')}: {formatKcal(metrics.bmr)}</Text>
              <Text variant="bodySmall">{t('home.tdee')}: {formatKcal(metrics.tdee)}</Text>
            </View>
            <MacroBar totals={metrics.macros} />
          </View>
        ) : (
          <Text>{t('planner.empty')}</Text>
        )}
      </Card>
      <Card title={t('home.weekly_progress')}>
        <View style={styles.sparkline} accessibilityLabel="Progression hebdomadaire simulée">
          {sparklineData.map((value, index) => (
            <View key={value + index} style={[styles.sparkBar, { height: (value / 2100) * 80 }]} />
          ))}
        </View>
      </Card>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('Planner' as never)}
        accessibilityLabel={t('home.plan_cta')}
      >
        {t('home.plan_cta')}
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  metricRow: {
    gap: 16,
  },
  sparkline: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 80,
    gap: 4,
  },
  sparkBar: {
    width: 12,
    borderRadius: 6,
    backgroundColor: '#1C7C54',
  },
});

export default HomeScreen;
