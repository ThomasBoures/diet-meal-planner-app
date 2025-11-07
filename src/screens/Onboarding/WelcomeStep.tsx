import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

export type WelcomeStepProps = {
  onNext: () => void;
};

const WelcomeStep = ({ onNext }: WelcomeStepProps) => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Text variant="displaySmall">{t('onboarding.welcome_title')}</Text>
      <Text variant="bodyLarge">{t('onboarding.welcome_subtitle')}</Text>
      <Button mode="contained" onPress={onNext} accessibilityLabel={t('onboarding.start')}>
        {t('onboarding.start')}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    gap: 24,
  },
});

export default WelcomeStep;
