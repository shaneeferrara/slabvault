// jest-expo handles the babel transform so pure-logic tests just work.
module.exports = {
  preset: 'jest-expo',
  // Only run our own unit tests, not anything inside node_modules.
  testMatch: ['<rootDir>/__tests__/**/*.test.ts'],
};
