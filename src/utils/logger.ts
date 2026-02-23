import pino from "pino";

import { NODE_ENV } from "../config";

const isDev = NODE_ENV !== "production";

export const logger = pino({
  transport: isDev ? { target: "pino-pretty" } : undefined,
});
