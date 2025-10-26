import request from "supertest";

import { sequelize } from "../../../src/database/connection";
import { app } from "../../../src/app";
import { User } from "../../../src/database/models/user.model";
import * as sessionService from "../../../src/services/sessions/updateSession.service";
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

describe("PUT /sessions/:id", () => {
  it("should respond with 200 status code", async () => {
    const session = await createTestSession();
    const updatedData = { name: "Updated Session Name" };

    const res = await request(app)
      .put(`/api/sessions/${session.get("id")}`)
      .send(updatedData);

    expect(res.statusCode).toBe(200);
  });

  it("should return the updated session", async () => {
    const session = await createTestSession();
    const updatedData = {
      name: "Updated Session Name",
      description: "Updated description",
      note: "Updated note",
      durationMinutes: 90,
    };

    const res = await request(app)
      .put(`/api/sessions/${session.get("id")}`)
      .send(updatedData);

    const parsedSession = sessionSchema.parse(res.body);

    expect(parsedSession).toMatchObject({
      id: session.get("id"),
      name: updatedData.name,
      description: updatedData.description,
      note: updatedData.note,
      durationMinutes: updatedData.durationMinutes,
    });
  });

  it("should allow partial updates", async () => {
    const session = await createTestSession();
    const updatedData = { name: "Only Name Updated" };

    const res = await request(app)
      .put(`/api/sessions/${session.get("id")}`)
      .send(updatedData);

    const parsedSession = sessionSchema.parse(res.body);

    expect(parsedSession).toMatchObject({
      id: session.get("id"),
      name: updatedData.name,
      description: newSession.description,
      note: newSession.note,
      durationMinutes: newSession.durationMinutes,
    });
  });

  describe("when the session does not exist", () => {
    it("should return 404 if session does not exist", async () => {
      const updatedData = { name: "Updated Name" };
      const res = await request(app)
        .put(`/api/sessions/999999`)
        .send(updatedData);

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Session not found");
    });
  });

  describe("when invalid request data is provided", () => {
    it("should return 400 for invalid session ID", async () => {
      const invalidSessionId = "one";
      const updatedData = { name: "Updated Name" };

      const res = await request(app)
        .put(`/api/sessions/${invalidSessionId}`)
        .send(updatedData);

      expect(res.statusCode).toBe(400);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toHaveProperty("path");
      expect(res.body[0]).toHaveProperty("message");
    });

    it("should return 400 for invalid duration (negative)", async () => {
      const session = await createTestSession();
      const invalidData = { durationMinutes: -10 };

      const res = await request(app)
        .put(`/api/sessions/${session.get("id")}`)
        .send(invalidData);

      expect(res.statusCode).toBe(400);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("when the server encounters an error", () => {
    beforeAll(() => {
      jest
        .spyOn(sessionService, "updateSession")
        .mockRejectedValue(new Error("DB failure"));
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should return 500 for internal server error", async () => {
      const session = await createTestSession();
      const updatedData = { name: "Updated Name" };

      const res = await request(app)
        .put(`/api/sessions/${session.get("id")}`)
        .send(updatedData);

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ message: "Internal Server Error" });
    });
  });
});
