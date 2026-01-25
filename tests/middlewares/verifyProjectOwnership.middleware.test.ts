import type { Request, Response, NextFunction } from "express";
import { verifyProjectOwnership } from "../../src/middlewares/verifyProjectOwnership.middleware";
import * as projectService from "../../src/services/projects/getProject.service";
import * as userService from "../../src/services/users/getUserById.service";

jest.mock("../../src/services/projects/getProject.service");
jest.mock("../../src/services/users/getUserById.service");

describe("verifyProjectOwnership middleware", () => {
  const next = jest.fn() as NextFunction;

  const mockRes = () =>
    ({
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }) as unknown as Response;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls next() when authenticated user owns the project", async () => {
    (projectService.getProjectById as jest.Mock).mockResolvedValue({
      id: 1,
      userId: 10,
    });

    (userService.getUserById as jest.Mock).mockResolvedValue({
      id: 10,
      sub: "auth0|owner",
    });

    const req = {
      params: { id: "1" },
      auth: {
        payload: { sub: "auth0|owner" },
      },
    } as unknown as Request;

    await verifyProjectOwnership(req as Request, mockRes(), next);

    expect(next).toHaveBeenCalled();
  });

  it("returns 403 when authenticated user does NOT own the project", async () => {
    (projectService.getProjectById as jest.Mock).mockResolvedValue({
      id: 1,
      userId: 10,
    });

    (userService.getUserById as jest.Mock).mockResolvedValue({
      id: 10,
      sub: "auth0|owner",
    });

    const res = mockRes();

    const req = {
      params: { id: "1" },
      auth: {
        payload: { sub: "auth0|attacker" },
      },
    } as unknown as Request;

    await verifyProjectOwnership(req as Request, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it("calls next() when user is not authenticated (no sub)", async () => {
    const req = {
      params: { id: "1" },
      auth: undefined,
    } as Partial<Request>;

    await verifyProjectOwnership(req as Request, mockRes(), next);

    expect(next).toHaveBeenCalled();
    expect(projectService.getProjectById).not.toHaveBeenCalled();
  });
});
