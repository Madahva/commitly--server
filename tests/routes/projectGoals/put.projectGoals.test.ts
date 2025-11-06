import request from "supertest";

import { sequelize } from "../../../src/database/connection";
import { app } from "../../../src/app";
import { User } from "../../../src/database/models/user.model";
import { newProjectGoal, createTestProjectGoal } from "../../helpers/mockData";
import { projectGoalSchema } from "../../../src/schemas/projectGoal.schema";
import * as projectGoalService from "../../../src/services/projectGoals/updateProjectGoals.service";

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

describe("PUT /projectGoals/:id", () => {
  it("should respond with 200 status code", async () => {
    const projectGoal = await createTestProjectGoal();
    const updatedData = { name: "Updated Project Goal Name" };

    const res = await request(app)
      .put(`/api/projectGoals/${projectGoal[0].get("id")}`)
      .send(updatedData);

    expect(res.statusCode).toBe(200);
  });

  it("should return the updated project goal", async () => {
    const projectGoal = await createTestProjectGoal();
    const updatedData = {
      name: "Updated Project Name",
      description: "Updated description",
    };

    const res = await request(app)
      .put(`/api/projectGoals/${projectGoal[0].get("id")}`)
      .send(updatedData);

    const parsedProjectGoal = projectGoalSchema.parse(res.body);

    expect(parsedProjectGoal).toMatchObject({
      id: projectGoal[0].get("id"),
      name: updatedData.name,
      description: updatedData.description,
    });
  });

  it("should allow partial updates", async () => {
    const projectGoal = await createTestProjectGoal();
    const updatedData = { name: "Only Name Updated" };

    const res = await request(app)
      .put(`/api/projectGoals/${projectGoal[0].get("id")}`)
      .send(updatedData);

    const parsedProjectGoal = projectGoalSchema.parse(res.body);

    expect(parsedProjectGoal).toMatchObject({
      id: projectGoal[0].get("id"),
      name: updatedData.name,
      description: newProjectGoal.description,
    });
  });

  describe("when the project goal does not exist", () => {
    it("should return 404 if project goal does not exist", async () => {
      const updatedData = { name: "Updated Name" };
      const res = await request(app)
        .put(`/api/projectGoals/999999`)
        .send(updatedData);

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Project goal not found");
    });
  });

  describe("when invalid request data is provided", () => {
    it("should return 400 for invalid project ID", async () => {
      const invalidProjectGoalId = "one";
      const updatedData = { name: "Updated Name" };

      const res = await request(app)
        .put(`/api/projectGoals/${invalidProjectGoalId}`)
        .send(updatedData);

      expect(res.statusCode).toBe(400);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toHaveProperty("path");
      expect(res.body[0]).toHaveProperty("message");
    });

    describe("when the server encounters an error", () => {
      beforeAll(() => {
        jest
          .spyOn(projectGoalService, "updateProjectGoals")
          .mockRejectedValue(new Error("DB failure"));
      });

      afterAll(() => {
        jest.restoreAllMocks();
      });

      it("should return 500 for internal server error", async () => {
        const projectGoal = await createTestProjectGoal();
        const updatedData = { name: "Updated Name" };

        const res = await request(app)
          .put(`/api/projectGoals/${projectGoal[0].get("id")}`)
          .send(updatedData);

        expect(res.statusCode).toBe(500);
        expect(res.body).toEqual({ message: "Internal Server Error" });
      });
    });
  });
});
