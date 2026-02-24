import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";
import { getRequestContext } from "./requestContext.middleware";

const REQUEST_TIMEOUT_MS = 30000; // 30 seconds

export const requestTimeoutMiddleware = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();

    const timeoutId = setTimeout(() => {
      if (!res.headersSent) {
        const context = getRequestContext();
        const timeElapsed = Date.now() - startTime;

        logger.warn(
          {
            timeout: REQUEST_TIMEOUT_MS,
            timeElapsed,
            path: req.path,
            method: req.method,
            context: {
              requestId: context?.requestId,
              userId: context?.userId,
            },
          },
          "Request timeout"
        );

        res.status(408).json({
          error: "REQUEST_TIMEOUT",
          message: "Request exceeded maximum time limit",
          requestId: context?.requestId,
        });
      }
    }, REQUEST_TIMEOUT_MS);

    res.on("finish", () => {
      clearTimeout(timeoutId);
    });

    next();
  };
};
