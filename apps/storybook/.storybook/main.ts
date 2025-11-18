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
    // {
    //   name: '@storybook/addon-react-native-web',
    //   options: {
    //     modulesToTranspile: [
    //       '@mockly/storybook',
    //       '@mockly/design-system',
    //       'mobile',
    //     ],
    //     modulesToAlias: {
    //       // 'react-native-package-name': 'react-native-web-package-name',
    //     },
    //   },
    // },
  ],
  framework: {
    name: '@storybook/react-native-web-vite',
    options: {
      pluginReactOptions: {
        babel: {
          plugins: ['react-native-reanimated/plugin'],
        },
      },
      modulesToTranspile: [
        '@mockly/design-system',
        '@mockly/typescript-config',
        '@mockly/storybook',
      ],
    },
  },

  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
  babel: {
    presets: ['module:@react-native/babel-preset'],
    plugins: [
      'transform-inline-environment-variables',
      ['babel-plugin-react-docgen-typescript', {exclude: 'node_modules'}],
      'react-native-reanimated/plugin',
    ],
  },
  viteFinal: async config => {
    config.resolve = config.resolve || {};
    // 모노레포라서 외부 패키지 transpile하도록 optimize
    config.optimizeDeps = {
      include: ['react-native-web', 'react-native'],
    };
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native': 'react-native-web',
    };

    return config;
  },
};

export default main;
