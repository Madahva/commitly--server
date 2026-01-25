import type { Request, Response, NextFunction } from "express";

jest.mock("../src/middlewares/auth0.middleware", () => ({
  checkJwt: (req: Request, res: Response, next: NextFunction) => next(),
}));
