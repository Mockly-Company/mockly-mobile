import {Preview} from '@storybook/react';
import '../App.css';
import {tw, useAppColorSchemeTw} from '@mockly/design-system';
import React, {useEffect} from 'react';
import {themes} from 'storybook/theming';
import {useDarkMode} from '@vueless/storybook-dark-mode';
import {DocsContainer} from '@storybook/addon-docs/blocks';
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
  },
  parameters: {
    actions: {argTypesRegex: '^on[A-Z].*'},
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: [
          'Welcome',
          ['디자인 시스템'],
          'Foundation',
          ['파운데이션 소개'],
          'Components',
          ['컴포넌트 소개'],
          'Layout',
          ['레이아웃 소개'],
          'Animations',
          ['애니메이션 소개'],
        ],
      },
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
    },
  },
  decorators: [
    Story => {
      const isDarkMode = useDarkMode();
      const [_, __, setColorScheme] = useAppColorSchemeTw(tw);

      useEffect(() => {
        setColorScheme(isDarkMode ? 'dark' : 'light');
      }, [isDarkMode, setColorScheme]);

      return <Story />;
    },
  ],
  tags: ['autodocs'],
};

export default preview;

function ThemedDocsContainer(
  props: React.ComponentProps<typeof DocsContainer>,
) {
  const isDarkMode = useDarkMode(); // the hook we defined above
  const [_, __, setColorScheme] = useAppColorSchemeTw(tw);
  useEffect(() => {
    setColorScheme(isDarkMode ? 'dark' : 'light');
  }, [isDarkMode, setColorScheme]);
  return (
    <DocsContainer
      theme={isDarkMode ? themes.dark : themes.light}
      context={props.context}
      key={isDarkMode ? 'dark' : 'light'}>
      {props.children}
    </DocsContainer>
  );
}
