const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
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
      path.resolve(workspaceRoot, 'packages/design-system/node_modules'),
      path.resolve(workspaceRoot, 'packages/api/node_modules'),
    ],
    extraNodeModules: {
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
    },
    unstable_enablePackageExports: true,
    unstable_enableSymlinks: true,
  },
};

module.exports = mergeConfig(getDefaultConfig(projectRoot), config);
