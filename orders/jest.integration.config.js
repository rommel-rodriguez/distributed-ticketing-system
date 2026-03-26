module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/**/__tests__/integration/**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/test/integration/setup.ts'],
  clearMocks: true,
  maxWorkers: 1,
  testTimeout: 30000,
};
