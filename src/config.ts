import { config } from "dotenv";
config({ quiet: true });

const env = process.env.NODE_ENV || "development";

type DBConfig = {
  DB_NAME: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_HOST: string;
};

function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function getConfig(environment: string): DBConfig {
  switch (environment) {
    case "development":
      return {
        DB_NAME: getEnvVar("DEV_DB_NAME"),
        DB_USER: getEnvVar("DEV_DB_USER"),
        DB_PASSWORD: getEnvVar("DEV_DB_PASSWORD"),
        DB_HOST: getEnvVar("DEV_DB_HOST"),
      };
    case "test":
      return {
        DB_NAME: getEnvVar("TEST_DB_NAME"),
        DB_USER: getEnvVar("TEST_DB_USER"),
        DB_PASSWORD: getEnvVar("TEST_DB_PASSWORD"),
        DB_HOST: getEnvVar("TEST_DB_HOST"),
      };
    case "production":
      return {
        DB_NAME: getEnvVar("PROD_DB_NAME"),
        DB_USER: getEnvVar("PROD_DB_USER"),
        DB_PASSWORD: getEnvVar("PROD_DB_PASSWORD"),
        DB_HOST: getEnvVar("PROD_DB_HOST"),
      };
    default:
      throw new Error(`Unknown environment: ${environment}`);
  }
}

const currentConfig = getConfig(env);
export const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST } = currentConfig;
export const PORT = process.env.PORT || 3000;
export const NODE_ENV = env;
