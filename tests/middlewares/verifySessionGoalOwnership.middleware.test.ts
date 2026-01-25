import type { Request, Response, NextFunction } from "express";
import { verifySessionGoalOwnership } from "../../src/middlewares/verifySessionGoalOwnership.middleware";
import * as sessionGoalService from "../../src/services/sessionGoals/getSessionGoalById.service";
import * as sessionService from "../../src/services/sessions/getSession.service";
import * as projectService from "../../src/services/projects/getProject.service";
import * as userService from "../../src/services/users/getUserById.service";

jest.mock("../../src/services/sessionGoals/getSessionGoalById.service");
jest.mock("../../src/services/sessions/getSession.service");
jest.mock("../../src/services/projects/getProject.service");
jest.mock("../../src/services/users/getUserById.service");

describe("verifySessionGoalOwnership middleware", () => {
  const next = jest.fn() as NextFunction;

  const mockRes = () =>
    ({
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }) as unknown as Response;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls next() when authenticated user owns the session goal", async () => {
    (sessionGoalService.getSessionGoalById as jest.Mock).mockResolvedValue({
      id: 1,
      sessionId: 2,
    });

    (sessionService.getSessionById as jest.Mock).mockResolvedValue({
      id: 2,
      projectId: 5,
    });

    (projectService.getProjectById as jest.Mock).mockResolvedValue({
      id: 5,
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

    await verifySessionGoalOwnership(req as Request, mockRes(), next);

    expect(next).toHaveBeenCalled();
  });

  it("returns 403 when authenticated user does NOT own the session goal", async () => {
    (sessionGoalService.getSessionGoalById as jest.Mock).mockResolvedValue({
      id: 1,
      sessionId: 2,
    });

    (sessionService.getSessionById as jest.Mock).mockResolvedValue({
      id: 2,
      projectId: 5,
    });

    (projectService.getProjectById as jest.Mock).mockResolvedValue({
      id: 5,
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

    await verifySessionGoalOwnership(req as Request, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it("calls next() when user is not authenticated (no sub)", async () => {
    const req = {
      params: { id: "1" },
      auth: undefined,
    } as Partial<Request>;

    await verifySessionGoalOwnership(req as Request, mockRes(), next);

    expect(next).toHaveBeenCalled();
    expect(sessionGoalService.getSessionGoalById).not.toHaveBeenCalled();
  });
});
