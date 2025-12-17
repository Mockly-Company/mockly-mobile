import rootConfig from '../../eslint.config.js';
import reactNative from 'eslint-plugin-react-native';
import testPlugin from 'eslint-plugin-testing-library';
import pluginQuery from '@tanstack/eslint-plugin-query';

export default [
  ...rootConfig,
  ...pluginQuery.configs['flat/recommended'],
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'react-native': reactNative,
    },
    rules: {
      'react-native/no-inline-styles': 'warn',
      'react-native/no-color-literals': 'off',
    },
  },
  {
    files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
    plugins: {
      'testing-library': testPlugin,
    },
  },
];
