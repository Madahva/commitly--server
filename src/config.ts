import { config } from "dotenv";
config({ quiet: true });

const env = process.env.NODE_ENV || "development";

type DBConfig = {
  DB_NAME: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_HOST: string;
};

const configs: Record<string, DBConfig> = {
  development: {
    DB_NAME: process.env.DEV_DB_NAME!,
    DB_USER: process.env.DEV_DB_USER!,
    DB_PASSWORD: process.env.DEV_DB_PASSWORD!,
    DB_HOST: process.env.DEV_DB_HOST!,
  },
  test: {
    DB_NAME: process.env.TEST_DB_NAME!,
    DB_USER: process.env.TEST_DB_USER!,
    DB_PASSWORD: process.env.TEST_DB_PASSWORD!,
    DB_HOST: process.env.TEST_DB_HOST!,
  },
  production: {
    DB_NAME: process.env.PROD_DB_NAME!,
    DB_USER: process.env.PROD_DB_USER!,
    DB_PASSWORD: process.env.PROD_DB_PASSWORD!,
    DB_HOST: process.env.PROD_DB_HOST!,
  },
};

const currentConfig = configs[env];

export const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST } = currentConfig;
export const PORT = process.env.PORT || 3000;
export const NODE_ENV = env;
