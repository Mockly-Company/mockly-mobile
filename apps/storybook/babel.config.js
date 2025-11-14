module.exports = {
  presets: ['module:@react-native/babel-preset', 'nativewind/babel'],
  plugins: [
    'transform-inline-environment-variables',
    ['babel-plugin-react-docgen-typescript', {exclude: 'node_modules'}],
    [
      require.resolve('react-native-reanimated/plugin'),
      {relativeSourceLocation: true},
    ],
  ],
};
