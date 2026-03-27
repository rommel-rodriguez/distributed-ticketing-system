module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/**/__tests__/system/**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/test/system/setup.ts'],
  clearMocks: true,
  maxWorkers: 1,
  testTimeout: 120000,
};
