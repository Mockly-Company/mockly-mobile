import { getDefaultConfig, mergeConfig } from '@react-native/metro-config';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const projectRoot = path.dirname(__filename);
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
      '@mockly/entities': path.resolve(workspaceRoot, 'packages/entities'),
      '@mockly/design-system': path.resolve(
        workspaceRoot,
        'packages/design-system',
      ),
      '@mockly/api': path.resolve(workspaceRoot, 'packages/api'),
      '@mockly/typescript-config': path.resolve(
        workspaceRoot,
        'packages/typescript-config',
      ),
    },
    unstable_enablePackageExports: true,
    unstable_enableSymlinks: true,
  },
};

export default mergeConfig(getDefaultConfig(projectRoot), config);
