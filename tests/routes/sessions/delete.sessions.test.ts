import request from "supertest";

import { sequelize } from "../../../src/database/connection";
import { app } from "../../../src/app";
import { User } from "../../../src/database/models/user.model";
import { Session } from "../../../src/database/models/session.model";
import * as sessionService from "../../../src/services/sessions/deleteSession.service";
import { createTestSession } from "../../helpers/mockData";

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

describe("DELETE /sessions/:id", () => {
  it("should respond with 204 status code", async () => {
    const session = await createTestSession();

    const res = await request(app).delete(`/api/sessions/${session.get("id")}`);

    expect(res.statusCode).toBe(204);
  });

  it("should delete the session from database", async () => {
    const session = await createTestSession();
    const sessionId = session.get("id");

    await request(app).delete(`/api/sessions/${sessionId}`);

    const deletedSession = await Session.findByPk(sessionId);
    expect(deletedSession).toBeNull();
  });

  describe("when the session does not exist", () => {
    it("should return 404 if session does not exist", async () => {
      const res = await request(app).delete(`/api/sessions/999999`);

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Session not found");
    });
  });

  describe("when invalid request data is provided", () => {
    it("should return 400 for invalid session ID", async () => {
      const invalidSessionId = "one";

      const res = await request(app).delete(
        `/api/sessions/${invalidSessionId}`
      );

      expect(res.statusCode).toBe(400);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toHaveProperty("path");
      expect(res.body[0]).toHaveProperty("message");
    });
  });

  describe("when the server encounters an error", () => {
    beforeAll(() => {
      jest
        .spyOn(sessionService, "deleteSession")
        .mockRejectedValue(new Error("DB failure"));
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should return 500 for internal server error", async () => {
      const session = await createTestSession();

      const res = await request(app).delete(
        `/api/sessions/${session.get("id")}`
      );

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ message: "Internal Server Error" });
    });
  });
});
