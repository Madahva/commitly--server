import { config } from "dotenv";
config({ quiet: true });

export const PORT = process.env.PORT || 3000;
export const DB_NAME = process.env.DB_NAME || "postgres";
export const DB_USER = process.env.DB_USER || "postgres";
export const DB_PASSWORD = process.env.DB_PASSWORD || "postgres";
export const DB_HOST = process.env.DB_HOST || "localhost";
