const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const {withStorybook} = require('@storybook/react-native/metro/withStorybook');
const {withNativeWind} = require('nativewind/metro');
const defaultConfig = getDefaultConfig(__dirname);

const path = require('path');
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');
const packagesPath = path.resolve(workspaceRoot, 'packages');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  watchFolders: [workspaceRoot, projectRoot, packagesPath],
  resolver: {
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      path.resolve(workspaceRoot, 'node_modules'),
    ],
    extraNodeModules: {
      '@mockly/design-system': path.resolve(
        workspaceRoot,
        'packages/design-system',
      ),
      '@mockly/typescript-config': path.resolve(
        workspaceRoot,
        'packages/typescript-config',
      ),
    },
    unstable_enablePackageExports: true,
    unstable_enableSymlinks: true,
  },
};

const finalConfig = withNativeWind(mergeConfig(defaultConfig, config), {
  input: path.resolve(__dirname, './global.css'),
});
module.exports = withStorybook(finalConfig, {
  // enabled: process.env.STORYBOOK_ENABLED === 'true',
  enabled: true,

  // Path to your storybook config (default: './.rnstorybook')
  configPath: path.resolve(__dirname, './.rnstorybook'),
});
