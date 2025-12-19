import { darkColors, lightColors, tw } from '@mockly/design-system';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useMemo } from 'react';
import { useAppColorScheme, useDeviceContext } from 'twrnc';

const THEME_LIGHT: typeof DefaultTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    background: lightColors.background,
    card: lightColors.background,
    border: lightColors.surface,
  },
};

const THEME_DARK: typeof DefaultTheme = {
  ...DarkTheme,
  dark: true,
  colors: {
    ...DarkTheme.colors,
    background: darkColors.background,
    card: darkColors.background,
    border: darkColors.surface,
  },
};

export const useDeviceColorScheme = () => {
  useDeviceContext(tw);
  const [colorScheme] = useAppColorScheme(tw);
  const isDarkMode = useMemo(() => colorScheme === 'dark', [colorScheme]);
  const naviTheme = useMemo(
    () => (isDarkMode ? THEME_DARK : THEME_LIGHT),
    [isDarkMode],
  );
  return { isDarkMode, naviTheme };
};
