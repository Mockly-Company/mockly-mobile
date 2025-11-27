const path = require('path');
/** @type {import('jest').Config} */
module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testEnvironment: 'node',
  rootDir: path.resolve(__dirname),
  // Override setupFiles to avoid ESM import issues
  setupFiles: ['<rootDir>/jest.setup.js'],
  setupFilesAfterEnv: [],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': [
      'babel-jest',
      {
        configFile: path.resolve(__dirname, 'babel.config.js'),
      },
    ],
  },
  // pnpm 환경에서는 모든 node_modules 변환 필요 (ESM 이슈)
  // 속도는 Jest 캐시와 maxWorkers로 최적화
  transformIgnorePatterns: [],
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
  // __mocks__
  moduleNameMapper: {
    '^@env$': '<rootDir>/__mocks__/@env.js',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    '^@features/(.*)$': '<rootDir>/src/features/$1',
    '^@lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
  },
  testMatch: ['**/__tests__/**/*.(test|spec).(ts|tsx|js)'],
  // react-native preset을 사용하지 않고 필요한 설정만 직접 구성
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
