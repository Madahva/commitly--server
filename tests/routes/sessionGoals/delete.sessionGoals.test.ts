import request from "supertest";

import { app } from "../../../src/app";
import { sequelize } from "../../../src/database/connection";
import { User } from "../../../src/database/models/user.model";
import { SessionGoal } from "../../../src/database/models";
import { createTestSessionGoal } from "../../helpers/mockData";
import { deleteSessionGoal } from "../../../src/services/sessionGoals/deleteSessionGoal.service";
import * as sessionGoalService from "../../../src/services/sessionGoals/deleteSessionGoal.service";

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

describe("deleteSessionGoal service", () => {
  it("should delete an existing sessionGoal", async () => {
    const sessionGoals = await createTestSessionGoal();
    const createdGoal = sessionGoals[0];

    const sessionGoalInDbBeforeDelete = await SessionGoal.findOne({
      where: { id: createdGoal.id },
    });

    expect(sessionGoalInDbBeforeDelete).not.toBeNull();

    await deleteSessionGoal(sessionGoalInDbBeforeDelete?.get("id"));

    const sessionGoalInDbAfterDelete = await SessionGoal.findOne({
      where: { id: createdGoal.id },
    });

    expect(sessionGoalInDbAfterDelete).toBeNull();
  });
});

describe("DELETE /sessionGoals/:id", () => {
  it("should return 204 when deleting an existing sessionGoal", async () => {
    const createdSessionGoal = await createTestSessionGoal();

    const response = await request(app).delete(
      `/api/sessionGoals/${createdSessionGoal[0].toJSON().id}`
    );

    expect(response.status).toBe(204);
  });

  it("should delete the session goal from database", async () => {
    const createdSessionGoal = await createTestSessionGoal();
    const sessionGoalId = createdSessionGoal[0].get("id");

    await request(app).delete(`/api/sessionGoals/${sessionGoalId}`);

    const deletedSessionGoal = await SessionGoal.findByPk(sessionGoalId);
    expect(deletedSessionGoal).toBeNull();
  });

  describe("when the session goal does not exist", () => {
    it("should return 404", async () => {
      const response = await request(app).delete("/api/sessionGoals/9999");

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "Session goal not found" });
    });
  });

  describe("when invalid request data is provided", () => {
    it("should return 400 for invalid session goal ID", async () => {
      const invalidSessionGoalId = "one";

      const res = await request(app).delete(
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
        .spyOn(sessionGoalService, "deleteSessionGoal")
        .mockRejectedValue(new Error("DB failure"));
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should return 500 for internal server error", async () => {
      const sessionGoal = await createTestSessionGoal();

      const res = await request(app).delete(
        `/api/sessionGoals/${sessionGoal[0].get("id")}`
      );

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ message: "Internal Server Error" });
    });
  });
});
