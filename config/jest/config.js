
module.exports = {
  rootDir: '../..',
  testEnvironment: 'jsdom',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/index.dev.tsx',
    '!**/index.tsx',
    '!**/index.ts',
  ],
  setupFilesAfterEnv: [
    '<rootDir>/config/jest/setup.js',
  ],
  testMatch: [
    '<rootDir>/(site|server)/**/*.test.(j|t)s?(x)',
  ],
  // moduleNameMapper: {}
  testURL: 'http://localhost',
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.p?css$': '<rootDir>/config/jest/cssTransform.js',
    '^(?!.*\\.(js|jsx|css|json)$)': '<rootDir>/config/jest/fileTransform.js',
  },
  moduleDirectories: [
    'node_modules'
  ],
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$',
  ],
  moduleFileExtensions: [
    'js',
    'jsx',
    'ts',
    'tsx',
    'json',
  ],
  globals: {
    '__JEST__': true,
    '__REMOTE_API__': true,
    '__LOG_LEVEL__': 'debug',
    '__DEV__': true,
    '__BUILD_VERSION__': 'development',
    'ts-jest': {
      tsConfig: require.resolve('../../tsconfig.test.json'),
    },
  },
  coverageThreshold: {
    global: {
      statements: 34,
      branches: 23,
      lines: 32,
      functions: 26,
    },
  },
}
