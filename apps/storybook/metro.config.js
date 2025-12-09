const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const {withStorybook} = require('@storybook/react-native/metro/withStorybook');
const defaultConfig = getDefaultConfig(__dirname);

const path = require('path');
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');
const packagesPath = path.resolve(workspaceRoot, 'packages');
const mobileSrcPath = path.resolve(workspaceRoot, 'apps/mobile/src');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  watchFolders: [workspaceRoot, projectRoot, packagesPath, mobileSrcPath],
  resolver: {
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      path.resolve(workspaceRoot, 'node_modules'),
      path.resolve(workspaceRoot, 'apps/mobile/node_modules'),
      path.resolve(workspaceRoot, 'packages/design-system/node_modules'),
      path.resolve(workspaceRoot, 'packages/api/node_modules'),
    ],
    extraNodeModules: {
      '@app': path.resolve(workspaceRoot, 'apps/mobile/src/app'),
      '@features': path.resolve(workspaceRoot, 'apps/mobile/src/features'),
      '@lib': path.resolve(workspaceRoot, 'apps/mobile/src/lib'),
      '@shared': path.resolve(workspaceRoot, 'apps/mobile/src/shared'),
      '@mockly/domain': path.resolve(workspaceRoot, 'packages/domain'),
      '@mockly/design-system': path.resolve(
        workspaceRoot,
        'packages/design-system',
      ),
      '@mockly/api': path.resolve(workspaceRoot, 'packages/api'),
      '@mockly/typescript-config': path.resolve(
        workspaceRoot,
        'packages/typescript-config',
      ),
      '@mockly/utils': path.resolve(workspaceRoot, 'packages/utils'),
      mobile: path.resolve(workspaceRoot, 'apps/mobile'),
    },
    unstable_enablePackageExports: true,
    unstable_enableSymlinks: true,
  },
};

const finalConfig = mergeConfig(defaultConfig, config);

module.exports = withStorybook(finalConfig, {
  // enabled: process.env.STORYBOOK_ENABLED === 'true',
  enabled: true,

  configPath: path.resolve(__dirname, './.rnstorybook'),
});
