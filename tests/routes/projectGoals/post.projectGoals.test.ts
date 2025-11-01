import request from "supertest";

import { app } from "../../../src/app";
import { sequelize } from "../../../src/database/connection";
import { User } from "../../../src/database/models/user.model";
import { ProjectGoal } from "../../../src/database/models";
import { projectGoalSchema } from "../../../src/schemas/projectGoal.schema";
import { createProjectGoal } from "../../../src/services/projectGoals/creteProjectGoal.service";
import * as projectGoalService from "../../../src/services/projectGoals/creteProjectGoal.service";
import {
  newProjectGoal,
  createTestProjectGoal,
  createTestProject,
} from "../../helpers/mockData";

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

describe("createProjectGoal service", () => {
  it("should create a new projectGoal", async () => {
    const createdGoal = await createTestProjectGoal();

    const projectGoalInDb = await ProjectGoal.findOne({
      where: { id: createdGoal[0].id },
    });

    expect(projectGoalInDb).not.toBeNull();
    expect(projectGoalInDb?.get("name")).toBe(`${newProjectGoal.name} 1`);
  });

  it("should return the created session", async () => {
    const createdProjectGoal = await createTestProjectGoal();
    const parsedProjectGoal = projectGoalSchema.parse(
      createdProjectGoal[0].toJSON()
    );

    expect(parsedProjectGoal).toMatchObject({
      name: `${newProjectGoal.name} 1`,
      description: newProjectGoal.description,
      status: newProjectGoal.status,
    });
  });

  it("should allow creating multiple porjectGoals for the same project", async () => {
    const project = await createTestProject();
    const projectId = project.toJSON().id;
    const projectGoalData = { projectId, ...newProjectGoal };

    await createProjectGoal(projectGoalData);
    await createProjectGoal(projectGoalData);

    const projectGoalsInDb = await ProjectGoal.findAll({
      where: { name: newProjectGoal.name },
    });

    expect(projectGoalsInDb).toHaveLength(2);
  });

  describe("POST /projectGoals", () => {
    it("should respond with 201", async () => {
      const project = await createTestProject();
      const projectId = project.toJSON().id;

      const res = await request(app)
        .post("/api/projectGoals")
        .send({ projectId, ...newProjectGoal });

      expect(res.statusCode).toBe(201);
    });

    it("should return the created projectGoal", async () => {
      const project = await createTestProject();
      const projectId = project.toJSON().id;

      const res = await request(app)
        .post("/api/projectGoals")
        .send({ projectId, ...newProjectGoal });

      const parsedProjectGoal = projectGoalSchema.parse(res.body);

      expect(parsedProjectGoal).toMatchObject({
        name: newProjectGoal.name,
        description: newProjectGoal.description,
        status: newProjectGoal.status,
      });
    });
  });

  describe("when invalid request data is provided", () => {
    it("should return 400 for invalid projectGoal data", async () => {
      const invalidProjectGoal = { name: "" };

      const res = await request(app)
        .post("/api/projectGoals")
        .send(invalidProjectGoal);

      expect(res.statusCode).toBe(400);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toHaveProperty("path");
      expect(res.body[0]).toHaveProperty("message");
    });
  });

  describe("when the server encounters an error", () => {
    beforeAll(() => {
      jest
        .spyOn(projectGoalService, "createProjectGoal")
        .mockRejectedValue(new Error("DB failure"));
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should return 500 for internal server error", async () => {
      const project = await createTestProject();
      const projectId = project.toJSON().id;

      const res = await request(app)
        .post("/api/projectGoals")
        .send({ projectId, ...newProjectGoal });

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ message: "Internal Server Error" });
    });
  });
});
