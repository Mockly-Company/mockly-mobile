const config = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    '@babel/plugin-transform-export-namespace-from',
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@app': './src/app',
          '@configs': './src/configs',
          '@errors': './src/errors',
          '@features': './src/features',
          '@hooks': './src/hooks',
          '@libs': './src/libs',
          '@utils': './src/utils',
        },
      },
    ],
    [
      'module:react-native-dotenv',
      {
        envName: 'APP_ENV',
        moduleName: '@env',
        path:
          process.env.NODE_ENV === 'test'
            ? './.env.test'
            : process.env.NODE_ENV === 'production'
              ? './.env.prod'
              : './.env.dev',
        blocklist: null,
        allowlist: null,
        safe: false,
        allowUndefined: true,
      },
      'react-native-dotenv',
    ],
    [
      require.resolve('react-native-reanimated/plugin'),
      // { relativeSourceLocation: true },
    ],
  ],
  env: {
    test: {
      plugins: [
        '@babel/plugin-transform-modules-commonjs',
        'dynamic-import-node',
      ],
    },
  },
};

module.exports = config;
