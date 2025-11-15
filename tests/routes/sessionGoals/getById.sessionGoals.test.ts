import request from "supertest";

import { app } from "../../../src/app";
import { sequelize } from "../../../src/database/connection";
import { User } from "../../../src/database/models/user.model";
import { getSessionGoalById } from "../../../src/services/sessionGoals/getSessionGoalById.service";
import { createTestSessionGoal } from "../../helpers/mockData";
import { sessionGoalSchema } from "../../../src/schemas/sessionGoal.schema";
import * as sessionGoalService from "../../../src/services/sessionGoals/getSessionGoalById.service";

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

describe("getSessionGoalById service", () => {
  it("should retrieve a session goal by its ID", async () => {
    const sessionGoals = await createTestSessionGoal(4);
    const targetGoal = sessionGoals[1];

    const fetchedGoal = await getSessionGoalById(targetGoal.get("id"));

    expect(fetchedGoal).not.toBeNull();
    expect(fetchedGoal?.get("id")).toBe(targetGoal.get("id"));
    expect(fetchedGoal?.get("name")).toBe(targetGoal.get("name"));
  });
});

describe("GET /sessionGoals/:id", () => {
  it("should respond with 200 status code", async () => {
    const sessionGoal = await createTestSessionGoal();
    const res = await request(app).get(
      `/api/sessionGoals/${sessionGoal[0].get("id")}`
    );

    expect(res.statusCode).toBe(200);
  });

  it("should return the session goal", async () => {
    const sessionGoal = await createTestSessionGoal();

    const res = await request(app).get(
      `/api/sessionGoals/${sessionGoal[0].get("id")}`
    );

    const parsedSessionGoal = sessionGoalSchema.parse(res.body);

    expect(parsedSessionGoal).toMatchObject({
      id: sessionGoal[0].get("id"),
      name: sessionGoal[0].get("name"),
      description: sessionGoal[0].get("description"),
      status: sessionGoal[0].get("status"),
    });
  });

  describe("when the session goal does not exist", () => {
    it("should return 404 if session goal does not exist", async () => {
      const res = await request(app).get(`/api/sessionGoals/999999`);
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Session Goal not found");
    });
  });

  describe("when invalid request data is provided", () => {
    it("should return 400", async () => {
      const invalidSessionGoalId = "one";
      const res = await request(app).get(
        `/api/sessionGoals/${invalidSessionGoalId}`
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
        .spyOn(sessionGoalService, "getSessionGoalById")
        .mockRejectedValue(new Error("DB failure"));
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should return 500 for internal server error", async () => {
      const sessionGoal = await createTestSessionGoal();

      const res = await request(app).get(
        `/api/sessionGoals/${sessionGoal[0].get("id")}`
      );

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ message: "Internal Server Error" });
    });
  });
});
