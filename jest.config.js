module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/scripts/**",
    "!src/middlewares/auth0.middleware.ts",
    "!src/database/connection.ts",
    "!src/server.ts",
  ],
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
};
