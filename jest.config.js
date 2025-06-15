module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  transformIgnorePatterns: [
    'node_modules/(?!(chalk|ansi-styles|strip-ansi|ansi-regex|wrap-ansi|string-width|is-fullwidth-code-point|emoji-regex)/)'
  ],
  moduleNameMapper: {
    '^#ansi-styles$': '<rootDir>/node_modules/chalk/source/vendor/ansi-styles/index.js'
  }
}; 