import type {StorybookConfig} from '@storybook/react-native-web-vite';

const main: StorybookConfig = {
  stories: [
    '../components/**/*.stories.?(ts|tsx|js|jsx)',
    '../../../packages/design-system/src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-links',
    '@storybook/addon-onboarding',
  ],
  framework: {
    name: '@storybook/react-native-web-vite',
    options: {
      pluginReactOptions: {
        jsxImportSource: 'nativewind',
        babel: {
          plugins: [
            'react-native-reanimated/plugin',
            // {
            //   name: '@babel/plugin-transform-react-jsx',
            //   manipulateOptions: opts => {
            //     opts.runtime = 'automatic';
            //     opts.importSource = 'nativewind';
            //   },
            // },
          ],
          presets: ['nativewind/babel'],
        },
      },
      modulesToTranspile: [
        '@mockly/design-system',
        '@mockly/typescript-config',
        'nativewind',
        'react-native-css-interop',
      ],
    },
  },

  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
  babel: {
    presets: ['module:@react-native/babel-preset', 'nativewind/babel'],
    plugins: [
      'transform-inline-environment-variables',
      ['babel-plugin-react-docgen-typescript', {exclude: 'node_modules'}],
      'react-native-reanimated/plugin',
    ],
  },
};

export default main;
