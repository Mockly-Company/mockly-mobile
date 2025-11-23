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
          '@features': './src/features',
          '@lib': './src/lib',
          '@shared': './src/shared',
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
      { relativeSourceLocation: true },
    ],
  ],
  env: {
    test: {
      plugins: ['@babel/plugin-transform-modules-commonjs'],
    },
  },
};

module.exports = config;
