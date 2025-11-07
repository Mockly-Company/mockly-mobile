import type { StorybookConfig } from '@storybook/react-native-web-vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: StorybookConfig = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../../../packages/design-system/src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    // '@storybook/addon-onboarding',
    // '@storybook/addon-themes',
    // '@storybook/addon-links',
    '@storybook/addon-docs',
    '@storybook/addon-react-native-web',
  ],
  framework: {
    name: '@storybook/react-native-web-vite',
    options: {
      pluginReactOptions: {
        jsxImportSource: 'nativewind',
      },
    },
  },
  core: {
    builder: '@storybook/builder-vite',
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
};

export default config;
