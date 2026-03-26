module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/src/services/**/__tests__/integration/*.service.test.ts',
  ],
  setupFilesAfterEnv: ['<rootDir>/src/test/integration/setup.compose.ts'],
  maxWorkers: 1, // Important for deterministic concurrency tests + less flakiness
  testTimeout: 120000,
};
