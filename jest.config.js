module.exports = {
  "testEnvironment": "node",
  "roots": [
    "<rootDir>/src"
  ],
  "testMatch": [
    "**/__tests__/**/*.+(ts|js)",
    "**/?(*.)+(spec|test).+(ts|js)"
  ],
  "transform": {
    "^.+\\.(ts)$": "ts-jest"
  },
}