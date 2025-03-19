globalThis.ngJest = {
    skipNgcc: true,
    tsconfig: 'tsconfig.spec.json',
  };
  
  /** @type {import('@jest/types').Config.InitialOptions} */
  module.exports = {
    preset: "jest-preset-angular",
    setupFilesAfterEnv: ["<rootDir>/setup-jest.ts"],
    coverageDirectory: './coverage',
    collectCoverage: true,
    coveragePathIgnorePatterns: [
      "/node_modules/",
      "<rootDir>/src/app/.+/.*\\.store\\.ts$", // Ignore all store.ts files in any subdirectory
      "<rootDir>/src/app/.+/.*\\.reducer\\.ts$", // Ignore all store.ts files in any subdirectory
      "<rootDir>/src/.+/.*\\.routes\\.ts$", // Ignore all store.ts files in any subdirectory
    ],
    // transform: {
    //   '^.+\\.ts$': 'ts-jest',
    // },
    // transformIgnorePatterns: [
    //   '/node_modules/(?!flat)/',
    // ],
    // moduleDirectories: ['node_modules', 'src'],
    // fakeTimers: {
    //   enableGlobally: true,
    // }
  };