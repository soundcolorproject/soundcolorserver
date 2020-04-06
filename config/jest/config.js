
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
  setupFiles: [
    '<rootDir>/config/jest/setup.js',
  ],
  testMatch: [
    '<rootDir>/src/**/*.test.(j|t)s?(x)',
  ],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  testURL: 'http://localhost',
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.p?css$': '<rootDir>/config/jest/cssTransform.js',
    '^(?!.*\\.(js|jsx|css|json)$)': '<rootDir>/config/jest/fileTransform.js',
  },
  moduleDirectories: [
    'node_modules', '<rootDir>/src'
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
    '__DEV__': true,
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
