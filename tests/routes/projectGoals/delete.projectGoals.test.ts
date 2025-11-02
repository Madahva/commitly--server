import request from "supertest";

import { app } from "../../../src/app";
import { sequelize } from "../../../src/database/connection";
import { User } from "../../../src/database/models/user.model";
import { ProjectGoal } from "../../../src/database/models";
import { createTestProjectGoal } from "../../helpers/mockData";
import { deleteProjectGoal } from "../../../src/services/projectGoals/deleteProjectGoal.service";
import * as projectGoalService from "../../../src/services/projectGoals/deleteProjectGoal.service";

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

describe("deleteProjectGoal service", () => {
  it("should delete an existing projectGoal", async () => {
    const projectGoals = await createTestProjectGoal();
    const createdGoal = projectGoals[0];

    const projectGoalInDbBeforeDelete = await ProjectGoal.findOne({
      where: { id: createdGoal.id },
    });

    expect(projectGoalInDbBeforeDelete).not.toBeNull();

    await deleteProjectGoal(projectGoalInDbBeforeDelete?.get("id"));

    const projectGoalInDbAfterDelete = await ProjectGoal.findOne({
      where: { id: createdGoal.id },
    });

    expect(projectGoalInDbAfterDelete).toBeNull();
  });
});

describe("DELETE /projectGoals/:id", () => {
  it("should return 204 when deleting an existing projectGoal", async () => {
    const createdProjectGoal = await createTestProjectGoal();

    const response = await request(app).delete(
      `/api/projectGoals/${createdProjectGoal[0].toJSON().id}`
    );

    expect(response.status).toBe(204);
  });

  it("should delete the project from database", async () => {
    const createdProjectGoal = await createTestProjectGoal();
    const projectGoalId = createdProjectGoal[0].get("id");

    await request(app).delete(`/api/projectGoals/${projectGoalId}`);

    const deletedProject = await ProjectGoal.findByPk(projectGoalId);
    expect(deletedProject).toBeNull();
  });

  describe("when the project does not exist", () => {
    it("should return 404", async () => {
      const response = await request(app).delete("/api/projectGoals/9999");

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "Project not found" });
    });
  });

  describe("when invalid request data is provided", () => {
    it("should return 400 for invalid project goal ID", async () => {
      const invalidProjectGoalId = "one";

      const res = await request(app).delete(
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
        .spyOn(projectGoalService, "deleteProjectGoal")
        .mockRejectedValue(new Error("DB failure"));
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should return 500 for internal server error", async () => {
      const projectGoal = await createTestProjectGoal();

      const res = await request(app).delete(
        `/api/projectGoals/${projectGoal[0].get("id")}`
      );

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ message: "Internal Server Error" });
    });
  });
});
