import {Preview} from '@storybook/react';
import '../App.css';
import {
  tw,
  useAppColorSchemeTw,
  useDeviceContextTw,
} from '@mockly/design-system';
import React, {useEffect} from 'react';
import {themes} from 'storybook/theming';
import {useDarkMode} from '@vueless/storybook-dark-mode';
import {DocsContainer} from '@storybook/addon-docs/blocks';
import {INITIAL_VIEWPORTS, MINIMAL_VIEWPORTS} from 'storybook/viewport';

const preview: Preview = {
  globalTypes: {
    locale: {
      description: 'Internationalization locale',
      toolbar: {
        icon: 'globe',
        items: [{value: 'kr', right: '🇰🇷', title: '한국어'}],
      },
    },
  },
  initialGlobals: {
    locale: 'kr',
    viewPort: {value: 'desktop', isRotated: false},
  },
  parameters: {
    layout: 'centered',
    actions: {argTypesRegex: '^on[A-Z].*'},
    backgrounds: {
      disable: true,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: [
          '디자인 시스템',
          ['디자인 시스템'],
          '파운데이션',
          ['파운데이션 소개'],
          '스크린',
          ['스크린 소개'],
          '컴포넌트',
          ['컴포넌트 소개'],
          '레이아웃',
          ['레이아웃 소개'],
          '애니메이션',
          ['애니메이션 소개'],
        ],
      },
    },
    viewport: {
      options: {...MINIMAL_VIEWPORTS, ...INITIAL_VIEWPORTS},
    },
    darkMode: {
      current: 'light',
      dark: {...themes.dark},
      light: {...themes.normal},
      classTarget: 'html',
      stylePreview: true,
    },
    docs: {
      container: ThemedDocsContainer,
      toc: true,
    },
  },
  decorators: [
    Story => {
      const isDarkMode = useDarkMode();
      const colorScheme = isDarkMode ? 'dark' : 'light';
      useDeviceContextTw(tw, {
        initialColorScheme: colorScheme,
        observeDeviceColorSchemeChanges: false,
      });
      const [_, __, setColorScheme] = useAppColorSchemeTw(tw);

      useEffect(() => {
        setColorScheme(colorScheme);
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [colorScheme]);

      return <Story />;
    },
  ],
  tags: ['autodocs'],
};

export default preview;

function ThemedDocsContainer(
  props: React.ComponentProps<typeof DocsContainer>,
) {
  const isDarkMode = useDarkMode();
  const colorScheme = isDarkMode ? 'dark' : 'light';
  useDeviceContextTw(tw, {
    initialColorScheme: colorScheme,
    observeDeviceColorSchemeChanges: false,
  });
  const [twColorScheme, __, setColorScheme] = useAppColorSchemeTw(tw);

  useEffect(() => {
    setColorScheme(colorScheme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorScheme]);

  return (
    <DocsContainer
      theme={isDarkMode ? themes.dark : themes.light}
      context={props.context}
      key={twColorScheme}>
      {props.children}
    </DocsContainer>
  );
}
