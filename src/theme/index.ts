import { useColorScheme } from 'react-native';
import { useMemo } from 'react';

import { darkTheme, lightTheme } from './paperTheme';

export const usePaperTheme = (forceDark?: boolean) => {
  const systemScheme = useColorScheme();
  return useMemo(() => {
    const isDark = forceDark ?? systemScheme === 'dark';
    return isDark ? darkTheme : lightTheme;
  }, [forceDark, systemScheme]);
};
