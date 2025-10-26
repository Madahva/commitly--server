import request from "supertest";

import { sequelize } from "../../../src/database/connection";
import { app } from "../../../src/app";
import { User } from "../../../src/database/models/user.model";
import { Session } from "../../../src/database/models/session.model";
import { Project } from "../../../src/database/models/project.model";
import * as sessionService from "../../../src/services/sessions/getProjectSessions.service";
import * as userSessionService from "../../../src/services/sessions/getUserSessions.service";
import { sessionSchema } from "../../../src/schemas/session.schema";
import {
  createTestSession,
  createTestProject,
  createTestUser,
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

describe("GET /sessions", () => {
  describe("when querying by projectId", () => {
    it("should respond with 200 status code", async () => {
      const session = await createTestSession();
      const res = await request(app).get(
        `/api/sessions?projectId=${session.get("projectId")}`
      );

      expect(res.statusCode).toBe(200);
    });

    it("should return all sessions for a project", async () => {
      const project = await createTestProject();
      const projectId = project.toJSON().id;

      const session1 = await Session.create({
        projectId,
        name: "First Session",
        description: "First desc",
        note: "First note",
        durationMinutes: 60,
      });

      const session2 = await Session.create({
        projectId,
        name: "Second Session",
        description: "Second desc",
        note: "Second note",
        durationMinutes: 90,
      });

      const res = await request(app).get(
        `/api/sessions?projectId=${projectId}`
      );

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(2);

      const parsedSessions = res.body.map((s: unknown) =>
        sessionSchema.parse(s)
      );

      expect(parsedSessions[0]).toMatchObject({
        id: session2.get("id"),
        name: "Second Session",
      });
      expect(parsedSessions[1]).toMatchObject({
        id: session1.get("id"),
        name: "First Session",
      });
    });

    it("should return empty array when project has no sessions", async () => {
      const project = await createTestProject();
      const nonExistentProjectId = project.toJSON().id + 1000;

      const res = await request(app).get(
        `/api/sessions?projectId=${nonExistentProjectId}`
      );

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(0);
    });

    describe("filtering", () => {
      it("should search by name (case-insensitive)", async () => {
        const project = await createTestProject();
        const projectId = project.toJSON().id;

        await Session.create({
          projectId,
          name: "Morning Coding",
          description: "desc",
          note: "note",
          durationMinutes: 60,
        });

        await Session.create({
          projectId,
          name: "Afternoon Meeting",
          description: "desc",
          note: "note",
          durationMinutes: 90,
        });

        await Session.create({
          projectId,
          name: "Evening Coding",
          description: "desc",
          note: "note",
          durationMinutes: 120,
        });

        const res = await request(app).get(
          `/api/sessions?projectId=${projectId}&name=coding`
        );

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(2);
        expect(res.body[0].name).toContain("Coding");
        expect(res.body[1].name).toContain("Coding");
      });
    });

    describe("pagination", () => {
      it("should paginate results with limit", async () => {
        const project = await createTestProject();
        const projectId = project.toJSON().id;

        await Session.create({
          projectId,
          name: "Session 1",
          description: "desc",
          note: "note",
          durationMinutes: 60,
        });

        await Session.create({
          projectId,
          name: "Session 2",
          description: "desc",
          note: "note",
          durationMinutes: 90,
        });

        await Session.create({
          projectId,
          name: "Session 3",
          description: "desc",
          note: "note",
          durationMinutes: 120,
        });

        const res = await request(app).get(
          `/api/sessions?projectId=${projectId}&limit=2`
        );

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(2);
      });

      it("should paginate results with limit and offset", async () => {
        const project = await createTestProject();
        const projectId = project.toJSON().id;

        await Session.create({
          projectId,
          name: "Session 1",
          description: "desc",
          note: "note",
          durationMinutes: 60,
        });

        await Session.create({
          projectId,
          name: "Session 2",
          description: "desc",
          note: "note",
          durationMinutes: 90,
        });

        await Session.create({
          projectId,
          name: "Session 3",
          description: "desc",
          note: "note",
          durationMinutes: 120,
        });

        const res = await request(app).get(
          `/api/sessions?projectId=${projectId}&limit=1&offset=1`
        );

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].name).toBe("Session 2");
      });
    });

    describe("sorting", () => {
      it("should sort by name ASC", async () => {
        const project = await createTestProject();
        const projectId = project.toJSON().id;

        await Session.create({
          projectId,
          name: "Zulu Session",
          description: "desc",
          note: "note",
          durationMinutes: 60,
        });

        await Session.create({
          projectId,
          name: "Alpha Session",
          description: "desc",
          note: "note",
          durationMinutes: 90,
        });

        await Session.create({
          projectId,
          name: "Beta Session",
          description: "desc",
          note: "note",
          durationMinutes: 120,
        });

        const res = await request(app).get(
          `/api/sessions?projectId=${projectId}&orderBy=name&order=ASC`
        );

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(3);
        expect(res.body[0].name).toBe("Alpha Session");
        expect(res.body[2].name).toBe("Zulu Session");
      });

      it("should sort by durationMinutes DESC", async () => {
        const project = await createTestProject();
        const projectId = project.toJSON().id;

        await Session.create({
          projectId,
          name: "Session 1",
          description: "desc",
          note: "note",
          durationMinutes: 60,
        });

        await Session.create({
          projectId,
          name: "Session 2",
          description: "desc",
          note: "note",
          durationMinutes: 120,
        });

        await Session.create({
          projectId,
          name: "Session 3",
          description: "desc",
          note: "note",
          durationMinutes: 90,
        });

        const res = await request(app).get(
          `/api/sessions?projectId=${projectId}&orderBy=durationMinutes&order=DESC`
        );

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(3);
        expect(res.body[0].durationMinutes).toBe(120);
        expect(res.body[1].durationMinutes).toBe(90);
        expect(res.body[2].durationMinutes).toBe(60);
      });

      it("should sort by createdAt DESC by default", async () => {
        const project = await createTestProject();
        const projectId = project.toJSON().id;

        await Session.create({
          projectId,
          name: "Older Session",
          description: "desc",
          note: "note",
          durationMinutes: 60,
        });

        await new Promise((resolve) => setTimeout(resolve, 100));

        await Session.create({
          projectId,
          name: "Newer Session",
          description: "desc",
          note: "note",
          durationMinutes: 90,
        });

        const res = await request(app).get(
          `/api/sessions?projectId=${projectId}`
        );

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(2);
        expect(res.body[0].name).toBe("Newer Session");
      });
    });
  });

  describe("when querying by userId", () => {
    it("should respond with 200 status code", async () => {
      const userId = await createTestUser();
      const res = await request(app).get(`/api/sessions?userId=${userId}`);

      expect(res.statusCode).toBe(200);
    });

    it("should return all sessions for a user across all their projects", async () => {
      const project1 = await createTestProject();
      const userId = project1.toJSON().userId;

      const project2 = await Project.create({
        userId,
        name: "Second Project",
        description: "desc",
        color: "#FF5733",
        isActive: true,
        trackTime: true,
      });

      const session1 = await Session.create({
        projectId: project1.toJSON().id,
        name: "Project 1 Session",
        description: "First project session",
        note: "note",
        durationMinutes: 60,
      });

      const session2 = await Session.create({
        projectId: project2.toJSON().id,
        name: "Project 2 Session",
        description: "Second project session",
        note: "note",
        durationMinutes: 90,
      });

      const res = await request(app).get(`/api/sessions?userId=${userId}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(2);

      const sessionIds = res.body.map((s: Session) => s.id);
      expect(sessionIds).toContain(session1.get("id"));
      expect(sessionIds).toContain(session2.get("id"));
    });

    it("should return empty array when user has no sessions", async () => {
      const userId = await createTestUser();

      const res = await request(app).get(`/api/sessions?userId=${userId}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(0);
    });

    describe("filtering", () => {
      it("should search by name (case-insensitive)", async () => {
        const project = await createTestProject();
        const userId = project.toJSON().userId;
        const projectId = project.toJSON().id;

        await Session.create({
          projectId,
          name: "Morning Coding",
          description: "desc",
          note: "note",
          durationMinutes: 60,
        });

        await Session.create({
          projectId,
          name: "Afternoon Meeting",
          description: "desc",
          note: "note",
          durationMinutes: 90,
        });

        await Session.create({
          projectId,
          name: "Evening Coding",
          description: "desc",
          note: "note",
          durationMinutes: 120,
        });

        const res = await request(app).get(
          `/api/sessions?userId=${userId}&name=coding`
        );

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(2);
        expect(res.body[0].name).toContain("Coding");
        expect(res.body[1].name).toContain("Coding");
      });
    });

    describe("pagination", () => {
      it("should paginate results with limit", async () => {
        const project = await createTestProject();
        const userId = project.toJSON().userId;
        const projectId = project.toJSON().id;

        await Session.create({
          projectId,
          name: "Session 1",
          description: "desc",
          note: "note",
          durationMinutes: 60,
        });

        await Session.create({
          projectId,
          name: "Session 2",
          description: "desc",
          note: "note",
          durationMinutes: 90,
        });

        await Session.create({
          projectId,
          name: "Session 3",
          description: "desc",
          note: "note",
          durationMinutes: 120,
        });

        const res = await request(app).get(
          `/api/sessions?userId=${userId}&limit=2`
        );

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(2);
      });

      it("should paginate results with limit and offset", async () => {
        const project = await createTestProject();
        const userId = project.toJSON().userId;
        const projectId = project.toJSON().id;

        await Session.create({
          projectId,
          name: "Session 1",
          description: "desc",
          note: "note",
          durationMinutes: 60,
        });

        await Session.create({
          projectId,
          name: "Session 2",
          description: "desc",
          note: "note",
          durationMinutes: 90,
        });

        await Session.create({
          projectId,
          name: "Session 3",
          description: "desc",
          note: "note",
          durationMinutes: 120,
        });

        const res = await request(app).get(
          `/api/sessions?userId=${userId}&limit=1&offset=1`
        );

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].name).toBe("Session 2");
      });
    });

    describe("sorting", () => {
      it("should sort by name ASC", async () => {
        const project = await createTestProject();
        const userId = project.toJSON().userId;
        const projectId = project.toJSON().id;

        await Session.create({
          projectId,
          name: "Zulu Session",
          description: "desc",
          note: "note",
          durationMinutes: 60,
        });

        await Session.create({
          projectId,
          name: "Alpha Session",
          description: "desc",
          note: "note",
          durationMinutes: 90,
        });

        await Session.create({
          projectId,
          name: "Beta Session",
          description: "desc",
          note: "note",
          durationMinutes: 120,
        });

        const res = await request(app).get(
          `/api/sessions?userId=${userId}&orderBy=name&order=ASC`
        );

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(3);
        expect(res.body[0].name).toBe("Alpha Session");
        expect(res.body[2].name).toBe("Zulu Session");
      });

      it("should sort by durationMinutes DESC", async () => {
        const project = await createTestProject();
        const userId = project.toJSON().userId;
        const projectId = project.toJSON().id;

        await Session.create({
          projectId,
          name: "Session 1",
          description: "desc",
          note: "note",
          durationMinutes: 60,
        });

        await Session.create({
          projectId,
          name: "Session 2",
          description: "desc",
          note: "note",
          durationMinutes: 120,
        });

        await Session.create({
          projectId,
          name: "Session 3",
          description: "desc",
          note: "note",
          durationMinutes: 90,
        });

        const res = await request(app).get(
          `/api/sessions?userId=${userId}&orderBy=durationMinutes&order=DESC`
        );

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(3);
        expect(res.body[0].durationMinutes).toBe(120);
        expect(res.body[1].durationMinutes).toBe(90);
        expect(res.body[2].durationMinutes).toBe(60);
      });

      it("should sort by createdAt DESC by default", async () => {
        const project = await createTestProject();
        const userId = project.toJSON().userId;
        const projectId = project.toJSON().id;

        await Session.create({
          projectId,
          name: "Older Session",
          description: "desc",
          note: "note",
          durationMinutes: 60,
        });

        await new Promise((resolve) => setTimeout(resolve, 100));

        await Session.create({
          projectId,
          name: "Newer Session",
          description: "desc",
          note: "note",
          durationMinutes: 90,
        });

        const res = await request(app).get(`/api/sessions?userId=${userId}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(2);
        expect(res.body[0].name).toBe("Newer Session");
      });
    });
  });

  describe("when invalid request data is provided", () => {
    it("should return 400 when neither projectId nor userId is provided", async () => {
      const res = await request(app).get(`/api/sessions`);

      expect(res.statusCode).toBe(400);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toHaveProperty("path");
      expect(res.body[0]).toHaveProperty("message");
    });

    it("should return 400 when projectId is invalid", async () => {
      const res = await request(app).get(`/api/sessions?projectId=invalid`);

      expect(res.statusCode).toBe(400);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toHaveProperty("path");
      expect(res.body[0]).toHaveProperty("message");
    });

    it("should return 400 when userId is invalid", async () => {
      const res = await request(app).get(`/api/sessions?userId=invalid`);

      expect(res.statusCode).toBe(400);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toHaveProperty("path");
      expect(res.body[0]).toHaveProperty("message");
    });

    it("should return 400 when limit is invalid", async () => {
      const session = await createTestSession();
      const res = await request(app).get(
        `/api/sessions?projectId=${session.get("projectId")}&limit=invalid`
      );

      expect(res.statusCode).toBe(400);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("should return 400 when orderBy is invalid", async () => {
      const session = await createTestSession();
      const res = await request(app).get(
        `/api/sessions?projectId=${session.get("projectId")}&orderBy=invalid`
      );

      expect(res.statusCode).toBe(400);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("when the server encounters an error", () => {
    describe("for projectId queries", () => {
      beforeAll(() => {
        jest
          .spyOn(sessionService, "getProjectSessions")
          .mockRejectedValue(new Error("DB failure"));
      });

      afterAll(() => {
        jest.restoreAllMocks();
      });

      it("should return 500 for internal server error", async () => {
        const session = await createTestSession();

        const res = await request(app).get(
          `/api/sessions?projectId=${session.get("projectId")}`
        );

        expect(res.statusCode).toBe(500);
        expect(res.body).toEqual({ message: "Internal Server Error" });
      });
    });

    describe("for userId queries", () => {
      beforeAll(() => {
        jest
          .spyOn(userSessionService, "getUserSessions")
          .mockRejectedValue(new Error("DB failure"));
      });

      afterAll(() => {
        jest.restoreAllMocks();
      });

      it("should return 500 for internal server error", async () => {
        const userId = await createTestUser();

        const res = await request(app).get(`/api/sessions?userId=${userId}`);

        expect(res.statusCode).toBe(500);
        expect(res.body).toEqual({ message: "Internal Server Error" });
      });
    });
  });
});
