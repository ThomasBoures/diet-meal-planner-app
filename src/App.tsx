import 'react-native-gesture-handler';

import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { I18nextProvider } from 'react-i18next';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

import RootNavigator from './navigation/RootNavigator';
import i18n from './i18n';
import { useUserStore } from './stores/userStore';
import { darkTheme, lightTheme } from './theme/paperTheme';

const App = () => {
  const scheme = useColorScheme();
  const settings = useUserStore(state => state.settings);

  useEffect(() => {
    void i18n.changeLanguage(settings.language);
  }, [settings.language]);

  const isDark = settings.theme === 'dark' || (settings.theme === 'system' && scheme === 'dark');
  const paperTheme = isDark ? darkTheme : lightTheme;

  return (
    <I18nextProvider i18n={i18n}>
      <PaperProvider theme={paperTheme}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StatusBar style={isDark ? 'light' : 'dark'} />
          <RootNavigator />
        </GestureHandlerRootView>
      </PaperProvider>
    </I18nextProvider>
  );
};

export default App;
