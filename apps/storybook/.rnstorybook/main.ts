import {StorybookConfig} from '@storybook/react-native';

const main: StorybookConfig = {
  stories: [
    '../components/**/*.stories.?(ts|tsx|js|jsx)',
    '../../../packages/design-system/src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../../../packages/design-system/src/**/*.mdx',
    '../src/**/*.stories.?(ts|tsx|js|jsx)',
    '../storyForMobile/**/*.stories.?(ts|tsx|js|jsx)',
  ],
  addons: [
    '@storybook/addon-ondevice-notes',
    '@storybook/addon-ondevice-controls',
    '@storybook/addon-ondevice-backgrounds',
    '@storybook/addon-ondevice-actions',
    '@storybook/addon-docs',
  ],
  reactNative: {
    playFn: false,
  },
  framework: '@storybook/react-native',
};

export default main;
