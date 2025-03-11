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