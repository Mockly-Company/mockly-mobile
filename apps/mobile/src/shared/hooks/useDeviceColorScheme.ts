import { tw } from '@mockly/design-system';
import { useMemo } from 'react';
import { useAppColorScheme, useDeviceContext } from 'twrnc';

export const useDeviceColorScheme = () => {
  useDeviceContext(tw);
  const [colorScheme] = useAppColorScheme(tw);
  const isDarkMode = useMemo(() => colorScheme === 'dark', [colorScheme]);
  return isDarkMode;
};
