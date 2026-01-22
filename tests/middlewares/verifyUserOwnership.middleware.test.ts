import type { Request, Response, NextFunction } from "express";
import { verifyUserOwnership } from "../../src/middlewares/verifyUserOwnership.middleware";
import * as userService from "../../src/services/users/getUserById.service";

jest.mock("../../src/services/users/getUserById.service");

describe("verifyUserOwnership middleware", () => {
  const next = jest.fn() as NextFunction;

  const mockRes = () =>
    ({
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }) as unknown as Response;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls next() when authenticated user owns the user resource", async () => {
    (userService.getUserById as jest.Mock).mockResolvedValue({
      id: 1,
      sub: "auth0|owner",
    });

    const req = {
      params: { id: "1" },
      auth: {
        payload: { sub: "auth0|owner" },
      },
    } as unknown as Request;

    await verifyUserOwnership(req, mockRes(), next);

    expect(userService.getUserById).toHaveBeenCalledWith(1);
    expect(next).toHaveBeenCalled();
  });

  it("returns 403 when authenticated user does NOT own the user resource", async () => {
    (userService.getUserById as jest.Mock).mockResolvedValue({
      id: 1,
      sub: "auth0|owner",
    });

    const res = mockRes();

    const req = {
      params: { id: "1" },
      auth: {
        payload: { sub: "auth0|attacker" },
      },
    } as unknown as Request;

    await verifyUserOwnership(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it("calls next() when user is not authenticated (no sub)", async () => {
    const req = {
      params: { id: "1" },
      auth: undefined,
    } as Partial<Request>;

    await verifyUserOwnership(req as Request, mockRes(), next);

    expect(next).toHaveBeenCalled();
    expect(userService.getUserById).not.toHaveBeenCalled();
  });
});
