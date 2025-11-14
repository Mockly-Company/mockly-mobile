const config = {
  presets: ['module:@react-native/babel-preset', 'nativewind/babel'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path:
          process.env.NODE_ENV === 'production'
            ? '../../.env.prod'
            : '../../.env.dev',
        blocklist: null,
        allowlist: null,
        safe: false,
        allowUndefined: true,
      },
    ],
    [
      require.resolve('react-native-reanimated/plugin'),
      { relativeSourceLocation: true },
    ],
  ],
};

module.exports = config;
