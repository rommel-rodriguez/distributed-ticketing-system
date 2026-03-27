module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/**/__tests__/unit/**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/test/unit/setup.ts'],
  clearMocks: true,
  maxWorkers: 1,
  testTimeout: 20000,
};
