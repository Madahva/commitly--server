import type { Request, Response, NextFunction } from "express";
import { checkJwt } from "../../src/middlewares/auth0.middleware";

interface MockRequest extends Partial<Request> {
  auth?: {
    payload: Record<string, unknown>;
    header: Record<string, unknown>;
    token: string;
  };
}

/**
 * Unit tests for checkJwt middleware
 * Tests the middleware's behavior when handling auth payloads
 * Does NOT test Auth0 signature verification (that's Auth0's responsibility)
 */

describe("checkJwt middleware", () => {
  describe("when auth payload is present", () => {
    it("should call next() with valid auth payload", async () => {
      const req: MockRequest = {
        auth: {
          payload: {
            sub: "auth0|user123",
            email: "test@example.com",
            email_verified: true,
          },
          header: {},
          token: "mock-token",
        },
      };
      const res = {} as Response;
      const next = jest.fn() as NextFunction;

      await checkJwt(req as Request, res, next);

      expect(next).toHaveBeenCalled();
    });

    it("should make auth payload available to next middleware", async () => {
      const authPayload: Record<string, unknown> = {
        sub: "auth0|user456",
        email: "user@example.com",
        name: "Test User",
      };

      const req: MockRequest = {
        auth: {
          payload: authPayload,
          header: {},
          token: "mock-token",
        },
      };
      const res = {} as Response;
      const next = jest.fn() as NextFunction;

      await checkJwt(req as Request, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.auth?.payload).toEqual(authPayload);
    });
  });

  describe("when authRequired is false (default config)", () => {
    it("should call next() when no auth is provided", async () => {
      const req: MockRequest = {
        headers: {},
      };
      const res = {} as Response;
      const next = jest.fn() as NextFunction;

      await checkJwt(req as Request, res, next);

      expect(next).toHaveBeenCalled();
    });

    it("should call next() when Authorization header is missing", async () => {
      const req: MockRequest = {
        headers: {
          "content-type": "application/json",
        },
      };
      const res = {} as Response;
      const next = jest.fn() as NextFunction;

      await checkJwt(req as Request, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("auth payload structure", () => {
    it("should pass through minimal auth payload", async () => {
      const req: MockRequest = {
        auth: {
          payload: { sub: "auth0|minimal" },
          header: {},
          token: "mock-token",
        },
      };
      const res = {} as Response;
      const next = jest.fn() as NextFunction;

      await checkJwt(req as Request, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.auth?.payload.sub).toBe("auth0|minimal");
    });

    it("should pass through extended auth payload", async () => {
      const fullPayload: Record<string, unknown> = {
        sub: "auth0|user789",
        email: "full@example.com",
        email_verified: true,
        name: "Full User",
        nickname: "fulluser",
        picture: "https://example.com/pic.jpg",
        updated_at: new Date().toISOString(),
      };

      const req: MockRequest = {
        auth: {
          payload: fullPayload,
          header: {},
          token: "mock-token",
        },
      };
      const res = {} as Response;
      const next = jest.fn() as NextFunction;

      await checkJwt(req as Request, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.auth?.payload).toEqual(fullPayload);
    });
  });
});
