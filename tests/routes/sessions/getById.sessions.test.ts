import request from "supertest";

import { sequelize } from "../../../src/database/connection";
import { app } from "../../../src/app";
import { User } from "../../../src/database/models/user.model";
import * as sessionService from "../../../src/services/sessions/getSession.service";
import { sessionSchema } from "../../../src/schemas/session.schema";
import { newSession, createTestSession } from "../../helpers/mockData";

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

describe("GET /sessions/:id", () => {
  it("should respond with 200 status code", async () => {
    const session = await createTestSession();
    const res = await request(app).get(`/api/sessions/${session.get("id")}`);

    expect(res.statusCode).toBe(200);
  });

  it("should return the session", async () => {
    const session = await createTestSession();
    const res = await request(app).get(`/api/sessions/${session.get("id")}`);
    const parsedSession = sessionSchema.parse(res.body);

    expect(parsedSession).toMatchObject({
      id: session.get("id"),
      name: newSession.name,
      description: newSession.description,
      note: newSession.note,
      durationMinutes: newSession.durationMinutes,
    });
  });

  describe("when the session does not exist", () => {
    it("should return 404 if session does not exist", async () => {
      const res = await request(app).get(`/api/sessions/999999`);
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Session not found");
    });
  });

  describe("when invalid request data is provided", () => {
    it("should return 400", async () => {
      const invalidSessionId = "one";
      const res = await request(app).get(`/api/sessions/${invalidSessionId}`);

      expect(res.statusCode).toBe(400);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toHaveProperty("path");
      expect(res.body[0]).toHaveProperty("message");
    });
  });

  describe("when the server encounters an error", () => {
    beforeAll(() => {
      jest
        .spyOn(sessionService, "getSessionById")
        .mockRejectedValue(new Error("DB failure"));
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should return 500 for internal server error", async () => {
      const session = await createTestSession();

      const res = await request(app).get(`/api/sessions/${session.get("id")}`);

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ message: "Internal Server Error" });
    });
  });
});
