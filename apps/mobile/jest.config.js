const path = require('path');
/** @type {import('jest').Config} */
module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  rootDir: path.resolve(__dirname),
  setupFiles: ['./node_modules/react-native-gesture-handler/jestSetup.js'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': [
      'babel-jest',
      {
        configFile: path.resolve(__dirname, 'babel.config.js'),
        plugins: [
          '@babel/plugin-transform-modules-commonjs',
          'babel-plugin-dynamic-import-node',
        ],
      },
    ],
  },
  passWithNoTests: true,

  // pnpm 이슈로 transformIgnorePatterns 비활성화
  transformIgnorePatterns: [],
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
  // __mocks__
  moduleNameMapper: {
    '^react-native-reanimated$':
      '<rootDir>/__mocks__/react-native-reanimated.js',
    '^@env$': '<rootDir>/__mocks__/@env.js',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    '^@features/(.*)$': '<rootDir>/src/features/$1',
    '^@libs/(.*)$': '<rootDir>/src/libs/$1',
    '^@configs/(.*)$': '<rootDir>/src/configs/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@errors/(.*)$': '<rootDir>/src/errors/$1',
  },
  testMatch: ['**/__tests__/**/*.(test|spec).(ts|tsx|js)'],
  haste: {
    defaultPlatform: 'android',
    platforms: ['android', 'ios', 'native'],
  },
  // 커버리지
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage/',
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!src/navigation/*.{ts,tsx}',
  ],
  // 간결한 출력 설정
  // verbose: false,
  // silent: true,
  // noStackTrace: true,
  // errorOnDeprecated: false,
};
