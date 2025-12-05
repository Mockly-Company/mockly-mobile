module.exports = function (api) {
  api.cache(true);

  return {
    presets: ['module:@react-native/babel-preset'],
    plugins: [
      'transform-inline-environment-variables',
      ['babel-plugin-react-docgen-typescript', {exclude: 'node_modules'}],
      [
        require.resolve('react-native-reanimated/plugin'),
        // {relativeSourceLocation: true},
      ],
    ],
  };
};
