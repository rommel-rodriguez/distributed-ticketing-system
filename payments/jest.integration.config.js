module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/**/*.integration.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/test/integration/setup.ts'],
  maxWorkers: 1, // Important for deterministic concurrency tests + less flakiness
  testTimeout: 120000,
};
