import pino from "pino";

import { NODE_ENV } from "../config";
import { getRequestContext } from "../middlewares/requestContext.middleware";

const isDev = NODE_ENV !== "production";

export const logger = pino({
  transport: isDev ? { target: "pino-pretty" } : undefined,
  mixin: () => {
    const context = getRequestContext();
    if (context) {
      return {
        requestId: context.requestId,
        userId: context.userId,
      };
    }
    return {};
  },
});
