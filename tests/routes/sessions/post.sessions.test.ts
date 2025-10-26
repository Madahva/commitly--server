import request from "supertest";

import { app } from "../../../src/app";
import { Session } from "../../../src/database/models/session.model";
import { User } from "../../../src/database/models/user.model";
import { sessionSchema } from "../../../src/schemas/session.schema";
import { sequelize } from "../../../src/database/connection";
import { createSession } from "../../../src/services/sessions/createSession.service";
import * as sessionService from "../../../src/services/sessions/createSession.service";
import {
  newSession,
  createTestSession,
  createTestProject,
} from "../../helpers/mockData";

beforeAll(async () => {
  await sequelize.sync({ force: true });
  jest.spyOn(console, "error").mockImplementation(() => {});
});

beforeEach(async () => {
  await User.destroy({ where: {}, truncate: true, cascade: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("createSession service", () => {
  it("should create a new session", async () => {
    await createTestSession();

    const sessionInDb = await Session.findOne({
      where: { name: newSession.name },
    });

    expect(sessionInDb).not.toBeNull();
    expect(sessionInDb?.get("name")).toBe(newSession.name);
  });

  it("should return the created session", async () => {
    const createdSession = await createTestSession();
    const parsedSession = sessionSchema.parse(createdSession.toJSON());

    expect(parsedSession).toMatchObject({
      name: newSession.name,
      description: newSession.description,
      note: newSession.note,
      durationMinutes: newSession.durationMinutes,
    });
  });

  it("should allow creating multiple sessions for the same project", async () => {
    const project = await createTestProject();
    const projectId = project.toJSON().id;
    const sessionData = { projectId, ...newSession };

    await createSession(sessionData);
    await createSession(sessionData);

    const sessionsInDb = await Session.findAll({
      where: { name: newSession.name },
    });

    expect(sessionsInDb).toHaveLength(2);
  });
});

describe("POST /sessions", () => {
  it("should respond with 201", async () => {
    const project = await createTestProject();
    const projectId = project.toJSON().id;

    const res = await request(app)
      .post("/api/sessions")
      .send({ projectId, ...newSession });

    expect(res.statusCode).toBe(201);
  });

  it("should return the created session", async () => {
    const project = await createTestProject();
    const projectId = project.toJSON().id;

    const res = await request(app)
      .post("/api/sessions")
      .send({ projectId, ...newSession });

    const parsedSession = sessionSchema.parse(res.body);

    expect(parsedSession).toMatchObject({
      name: newSession.name,
      description: newSession.description,
      note: newSession.note,
      durationMinutes: newSession.durationMinutes,
    });
  });

  describe("when invalid request data is provided", () => {
    it("should return 400 for invalid session data", async () => {
      const invalidSession = { name: "" };

      const res = await request(app).post("/api/sessions").send(invalidSession);

      expect(res.statusCode).toBe(400);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toHaveProperty("path");
      expect(res.body[0]).toHaveProperty("message");
    });
  });

  describe("when the server encounters an error", () => {
    beforeAll(() => {
      jest
        .spyOn(sessionService, "createSession")
        .mockRejectedValue(new Error("DB failure"));
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should return 500 for internal server error", async () => {
      const project = await createTestProject();
      const projectId = project.toJSON().id;

      const res = await request(app)
        .post("/api/sessions")
        .send({ projectId, ...newSession });

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ message: "Internal Server Error" });
    });
  });
});
