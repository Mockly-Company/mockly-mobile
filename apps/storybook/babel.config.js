module.exports = function (api) {
  api.cache(true);

  return {
    presets: ['module:@react-native/babel-preset'],
    plugins: [
      '@babel/plugin-transform-export-namespace-from',
      'transform-inline-environment-variables',
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            '@app': '../mobile/src/app',
            '@features': '../mobile/src/features',
            '@lib': '../mobile/src/lib',
            '@shared': '../mobile/src/shared',
            '@mobile': '../mobile/src',
            '@mockly/entities': '../../packages/entities',
            '@mockly/design-system': '../../packages/design-system',
            '@mockly/api': '../../packages/api',
            '@mockly/typescript-config': '../../packages/typescript-config',
            '@mockly/utils': '../../packages/utils',
          },
        },
      ],
      [
        require.resolve('react-native-reanimated/plugin'),
        // {relativeSourceLocation: true},
      ],
      [
        'module:react-native-dotenv',
        {
          envName: 'APP_ENV',
          moduleName: '@env',
          path: './.env',
          blocklist: null,
          allowlist: null,
          safe: false,
          allowUndefined: true,
        },
        'react-native-dotenv',
      ],
    ],
  };
};
