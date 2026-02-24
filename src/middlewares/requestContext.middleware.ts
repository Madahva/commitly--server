import { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";
import { AsyncLocalStorage } from "async_hooks";

export interface RequestContext {
  requestId: string;
  userId?: string;
  timestamp: Date;
}

interface AuthenticatedRequest extends Request {
  user?: { sub: string };
}

export const requestContextStore = new AsyncLocalStorage<RequestContext>();

export const requestContextMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const requestId = (req.headers["x-request-id"] as string) || randomUUID();
  const userId = req.user?.sub;

  const context: RequestContext = {
    requestId,
    userId,
    timestamp: new Date(),
  };

  requestContextStore.run(context, () => {
    res.setHeader("x-request-id", requestId);
    next();
  });
};

export const getRequestContext = (): RequestContext | undefined => {
  return requestContextStore.getStore();
};
