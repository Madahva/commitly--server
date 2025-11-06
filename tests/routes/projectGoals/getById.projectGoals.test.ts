import request from "supertest";

import { app } from "../../../src/app";
import { sequelize } from "../../../src/database/connection";
import { User } from "../../../src/database/models/user.model";
import { getProjectGoalById } from "../../../src/services/projectGoals/getProjectGoalById.service";
import { createTestProjectGoal } from "../../helpers/mockData";
import { projectGoalSchema } from "../../../src/schemas/projectGoal.schema";
import * as projectGoalService from "../../../src/services/projectGoals/getProjectGoalById.service";

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

describe("getProjectGoalById service", () => {
  it("should retrieve a project goal by its ID", async () => {
    const projectGoals = await createTestProjectGoal(4);
    const targetGoal = projectGoals[1];

    const fetchedGoal = await getProjectGoalById(targetGoal.get("id"));

    expect(fetchedGoal).not.toBeNull();
    expect(fetchedGoal?.get("id")).toBe(targetGoal.get("id"));
    expect(fetchedGoal?.get("name")).toBe(targetGoal.get("name"));
  });
});

describe("GET /projectGoals/:id", () => {
  it("should respond with 200 status code", async () => {
    const projectGoal = await createTestProjectGoal();
    const res = await request(app).get(
      `/api/projectGoals/${projectGoal[0].get("id")}`
    );

    expect(res.statusCode).toBe(200);
  });

  it("should return the project", async () => {
    const projectGoal = await createTestProjectGoal();

    const res = await request(app).get(
      `/api/projectGoals/${projectGoal[0].get("id")}`
    );

    const parsedProjectGaol = projectGoalSchema.parse(res.body);

    expect(parsedProjectGaol).toMatchObject({
      id: projectGoal[0].get("id"),
      name: projectGoal[0].get("name"),
      description: projectGoal[0].get("description"),
      status: projectGoal[0].get("status"),
    });
  });

  describe("when the project goal does not exist", () => {
    it("should return 404 if project goal does not exist", async () => {
      const res = await request(app).get(`/api/projectGoals/999999`);
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Project Goal not found");
    });
  });

  describe("when invalid request data is provided", () => {
    it("should return 400", async () => {
      const invalidProjectGoalId = "one";
      const res = await request(app).get(
        `/api/projectGoals/${invalidProjectGoalId}`
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
        .spyOn(projectGoalService, "getProjectGoalById")
        .mockRejectedValue(new Error("DB failure"));
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should return 500 for internal server error", async () => {
      const projectGoal = await createTestProjectGoal();

      const res = await request(app).get(
        `/api/projectGoals/${projectGoal[0].get("id")}`
      );

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ message: "Internal Server Error" });
    });
  });
});
