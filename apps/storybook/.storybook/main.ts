import type {StorybookConfig} from '@storybook/react-native-web-vite';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const main: StorybookConfig = {
  stories: [
    '../components/**/*.stories.?(ts|tsx|js|jsx)',
    '../../../packages/design-system/src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../../../packages/design-system/src/**/*.mdx',
    '../src/**/*.stories.?(ts|tsx|js|jsx)',
    '../storyForWeb/**/*.stories.?(ts|tsx|js|jsx)',
  ],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-links',
    // '@storybook/addon-onboarding',
    '@vueless/storybook-dark-mode',
    '@storybook/addon-designs',
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
        '@mockly/api',
        '@mockly/entities',
        '@mockly/utils',
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
    config.optimizeDeps = {
      ...config.optimizeDeps,
    };
    config.publicDir = '../public';
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native': 'react-native-web',
      'react-native-linear-gradient': 'react-native-web-linear-gradient',
      '@mobile': path.resolve(__dirname, '../../mobile/src'),
      '@env': path.resolve(__dirname, '../__mocks__/@env.js'),
    };
    config.build = {
      ...config.build,
      commonjsOptions: {
        ...config.build?.commonjsOptions,
        transformMixedEsModules: true,
      },
    };
    config.assetsInclude = ['**/*.ttf', '**/*.mp4'];

    return config;
  },
  staticDirs: ['../public'],
  previewBody: _body => {
    return `<body></body>`;
  },
  previewHead: _head => {
    return `<head>
      <style>
        html {
          display: flex;
          width: 100%;
          height: 100%;
        }
        body {
          justify-content: center;
          background-color: #f8f9fc;
          margin: auto;
          #storybook-root {
            margin:auto;
            width:fit-content;
            height:fit-content;  
          }
        }
        .dark body {
          background-color: #1a1a1a;
        }
      </style>
    </head>`;
  },
};

export default main;
