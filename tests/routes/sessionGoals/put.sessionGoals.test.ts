import request from "supertest";

import { sequelize } from "../../../src/database/connection";
import { app } from "../../../src/app";
import { User } from "../../../src/database/models/user.model";
import { newSessionGoal, createTestSessionGoal } from "../../helpers/mockData";
import { sessionGoalSchema } from "../../../src/schemas/sessionGoal.schema";
import * as sessionGoalService from "../../../src/services/sessionGoals/updateSessionGoal.service";

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

describe("PUT /sessionGoals/:id", () => {
  it("should respond with 200 status code", async () => {
    const sessionGoal = await createTestSessionGoal();
    const updatedData = { name: "Updated Session Goal Name" };

    const res = await request(app)
      .put(`/api/sessionGoals/${sessionGoal[0].get("id")}`)
      .send(updatedData);

    expect(res.statusCode).toBe(200);
  });

  it("should return the updated session goal", async () => {
    const sessionGoal = await createTestSessionGoal();
    const updatedData = {
      name: "Updated Session Name",
      description: "Updated description",
    };

    const res = await request(app)
      .put(`/api/sessionGoals/${sessionGoal[0].get("id")}`)
      .send(updatedData);

    const parsedSessionGoal = sessionGoalSchema.parse(res.body);

    expect(parsedSessionGoal).toMatchObject({
      id: sessionGoal[0].get("id"),
      name: updatedData.name,
      description: updatedData.description,
    });
  });

  it("should allow partial updates", async () => {
    const sessionGoal = await createTestSessionGoal();
    const updatedData = { name: "Only Name Updated" };

    const res = await request(app)
      .put(`/api/sessionGoals/${sessionGoal[0].get("id")}`)
      .send(updatedData);

    const parsedSessionGoal = sessionGoalSchema.parse(res.body);

    expect(parsedSessionGoal).toMatchObject({
      id: sessionGoal[0].get("id"),
      name: updatedData.name,
      description: newSessionGoal.description,
    });
  });

  describe("when the session goal does not exist", () => {
    it("should return 404 if session goal does not exist", async () => {
      const updatedData = { name: "Updated Name" };
      const res = await request(app)
        .put(`/api/sessionGoals/999999`)
        .send(updatedData);

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Session goal not found");
    });
  });

  describe("when invalid request data is provided", () => {
    it("should return 400 for invalid session ID", async () => {
      const invalidSessionGoalId = "one";
      const updatedData = { name: "Updated Name" };

      const res = await request(app)
        .put(`/api/sessionGoals/${invalidSessionGoalId}`)
        .send(updatedData);

      expect(res.statusCode).toBe(400);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toHaveProperty("path");
      expect(res.body[0]).toHaveProperty("message");
    });

    describe("when the server encounters an error", () => {
      beforeAll(() => {
        jest
          .spyOn(sessionGoalService, "updateSessionGoal")
          .mockRejectedValue(new Error("DB failure"));
      });

      afterAll(() => {
        jest.restoreAllMocks();
      });

      it("should return 500 for internal server error", async () => {
        const sessionGoal = await createTestSessionGoal();
        const updatedData = { name: "Updated Name" };

        const res = await request(app)
          .put(`/api/sessionGoals/${sessionGoal[0].get("id")}`)
          .send(updatedData);

        expect(res.statusCode).toBe(500);
        expect(res.body).toEqual({ message: "Internal Server Error" });
      });
    });
  });
});
