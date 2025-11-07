import { MD3DarkTheme, MD3LightTheme, configureFonts } from 'react-native-paper';

const fontConfig = {
  config: {
    fontFamily: 'System',
  },
};

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#1C7C54',
    secondary: '#F5B700',
    background: '#F8FAFD',
    surface: '#FFFFFF',
    error: '#B00020',
  },
  fonts: configureFonts({ config: fontConfig.config }),
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#64D99D',
    secondary: '#F5B700',
    background: '#121212',
    surface: '#1E1E1E',
    error: '#CF6679',
  },
  fonts: configureFonts({ config: fontConfig.config }),
};
