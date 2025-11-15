import request from "supertest";

import { app } from "../../../src/app";
import { sequelize } from "../../../src/database/connection";
import { User } from "../../../src/database/models/user.model";
import { SessionGoal } from "../../../src/database/models";
import {
  createTestSessionGoal,
  createTestSession,
} from "../../helpers/mockData";

beforeAll(async () => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  await sequelize.sync({ force: true });
});

beforeEach(async () => {
  await User.destroy({ where: {}, truncate: true, cascade: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("GET /sessionGoals", () => {
  it("should respond with 200 status code", async () => {
    const sessionGoal = await createTestSessionGoal();

    const res = await request(app).get(
      `/api/sessionGoals?sessionId=${sessionGoal[0].get("sessionId")}`
    );
    expect(res.statusCode).toBe(200);
  });

  it("should return all session goals for a session", async () => {
    const sessionGoal = await createTestSessionGoal(2);

    const res = await request(app).get(
      `/api/sessionGoals?sessionId=${sessionGoal[0].get("sessionId")}`
    );

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(2);
  });

  it("should return empty array when session has no sessionGoals", async () => {
    const session = await createTestSession();
    const res = await request(app).get(
      `/api/sessionGoals?sessionId=${session.get("id")}`
    );
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(0);
  });

  describe("filtering", () => {
    it("should search by name (case-insensitive)", async () => {
      const session = await createTestSession();
      const sessionId = session.toJSON().id;

      await SessionGoal.create({
        sessionId,
        name: "Morning Coding",
        description: "desc",
        status: "pending" as const,
      });

      await SessionGoal.create({
        sessionId,
        name: "Afternoon Meeting",
        description: "desc",
        status: "pending" as const,
      });

      await SessionGoal.create({
        sessionId,
        name: "Evening Coding",
        description: "desc",
        status: "pending" as const,
      });

      const res = await request(app).get(
        `/api/sessionGoals?sessionId=${session.get("id")}&name=Coding`
      );

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body[0].name).toContain("Coding");
      expect(res.body[1].name).toContain("Coding");
    });

    it("should combine multiple filters", async () => {
      const session = await createTestSession();
      const sessionId = session.toJSON().id;

      await SessionGoal.create({
        sessionId,
        name: "Morning Coding Session",
        description: "desc",
        status: "pending" as const,
      });

      await SessionGoal.create({
        sessionId,
        name: "Morning Review",
        description: "desc",
        status: "completed" as const,
      });

      await SessionGoal.create({
        sessionId,
        name: "Evening Coding Session",
        description: "desc",
        status: "pending" as const,
      });

      await SessionGoal.create({
        sessionId,
        name: "Afternoon Coding",
        description: "desc",
        status: "completed" as const,
      });

      const res = await request(app).get(
        `/api/sessionGoals?sessionId=${sessionId}&name=Coding&limit=2&orderBy=name&order=ASC`
      );

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body[0].name).toContain("Coding");
      expect(res.body[1].name).toContain("Coding");
      expect(res.body[0].name).toBe("Afternoon Coding");
    });
  });
});

describe("pagination", () => {
  it("should paginate results with limit and offset", async () => {
    const session = await createTestSession();
    const sessionId = session.toJSON().id;

    await SessionGoal.create({
      sessionId,
      name: "Morning Coding Session",
      description: "desc",
      status: "pending" as const,
    });

    await SessionGoal.create({
      sessionId,
      name: "Morning Review",
      description: "desc",
      status: "completed" as const,
    });

    await SessionGoal.create({
      sessionId,
      name: "Evening Coding Session",
      description: "desc",
      status: "pending" as const,
    });

    const res = await request(app).get(
      `/api/sessionGoals?sessionId=${sessionId}&limit=2&offset=1&order=ASC`
    );

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].name).toBe("Morning Review");
    expect(res.body[1].name).toBe("Evening Coding Session");
  });
});

describe("sorting", () => {
  it("should sort by name DESC", async () => {
    const session = await createTestSession();
    const sessionId = session.toJSON().id;

    await SessionGoal.create({
      sessionId,
      name: "Alpha Goal",
      description: "desc",
      status: "pending" as const,
    });

    await SessionGoal.create({
      sessionId,
      name: "Zeta Goal",
      description: "desc",
      status: "completed" as const,
    });

    await SessionGoal.create({
      sessionId,
      name: "Beta Goal",
      description: "desc",
      status: "pending" as const,
    });

    const res = await request(app).get(
      `/api/sessionGoals?sessionId=${sessionId}&orderBy=name&order=DESC`
    );

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(3);
    expect(res.body[0].name).toBe("Zeta Goal");
    expect(res.body[1].name).toBe("Beta Goal");
    expect(res.body[2].name).toBe("Alpha Goal");
  });

  it("should sort by createdAt DESC by default", async () => {
    const session = await createTestSession();
    const sessionId = session.toJSON().id;

    await SessionGoal.create({
      sessionId,
      name: "First Goal",
      description: "desc",
      status: "pending" as const,
    });

    await new Promise((resolve) => setTimeout(resolve, 10));

    await SessionGoal.create({
      sessionId,
      name: "Second Goal",
      description: "desc",
      status: "completed" as const,
    });

    await new Promise((resolve) => setTimeout(resolve, 10));

    await SessionGoal.create({
      sessionId,
      name: "Third Goal",
      description: "desc",
      status: "pending" as const,
    });

    const res = await request(app).get(
      `/api/sessionGoals?sessionId=${sessionId}`
    );

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(3);
    expect(res.body[0].name).toBe("Third Goal");
    expect(res.body[1].name).toBe("Second Goal");
    expect(res.body[2].name).toBe("First Goal");
  });
});

describe("when invalid request data is provided", () => {
  it("should return 400 when sessionId is invalid", async () => {
    const sessionId = "invalid-id";

    const res = await request(app).get(
      `/api/sessionGoals?sessionId=${sessionId}`
    );

    expect(res.statusCode).toBe(400);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty("path");
    expect(res.body[0]).toHaveProperty("message");
  });

  it("should return 400 when limit is invalid", async () => {
    const session = await createTestSession();
    const sessionId = session.toJSON().id;

    const res = await request(app).get(
      `/api/sessionGoals?sessionId=${sessionId}&limit=invalid-limit`
    );

    expect(res.statusCode).toBe(400);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty("path");
  });

  it("should return 400 when orderBy is invalid", async () => {
    const session = await createTestSession();
    const sessionId = session.toJSON().id;

    const res = await request(app).get(
      `/api/sessionGoals?sessionId=${sessionId}&orderBy=invalid-field`
    );

    expect(res.statusCode).toBe(400);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty("path");
  });
});
