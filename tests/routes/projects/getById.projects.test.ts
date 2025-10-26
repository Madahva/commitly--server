import request from "supertest";

import { sequelize } from "../../../src/database/connection";
import { app } from "../../../src/app";
import { User } from "../../../src/database/models/user.model";
import * as projectService from "../../../src/services/projects/getProject.service";
import { projectSchema } from "../../../src/schemas/project.schema";
import { newProject, createTestProject } from "../../helpers/mockData";

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

describe("GET /projects/:id", () => {
  it("should respond with 200 status code", async () => {
    const project = await createTestProject();
    const res = await request(app).get(`/api/projects/${project.get("id")}`);

    expect(res.statusCode).toBe(200);
  });

  it("should return the project", async () => {
    const project = await createTestProject();
    const res = await request(app).get(`/api/projects/${project.get("id")}`);
    const parsedProject = projectSchema.parse(res.body);

    expect(parsedProject).toMatchObject({
      id: project.get("id"),
      name: newProject.name,
      description: newProject.description,
      color: newProject.color,
      isActive: newProject.isActive,
      trackTime: newProject.trackTime,
    });
  });

  describe("when the project does not exist", () => {
    it("should return 404 if project does not exist", async () => {
      const res = await request(app).get(`/api/projects/999999`);
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Project not found");
    });
  });

  describe("when invalid request data is provided", () => {
    it("should return 400", async () => {
      const invalidProjectId = "one";
      const res = await request(app).get(`/api/projects/${invalidProjectId}`);

      expect(res.statusCode).toBe(400);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toHaveProperty("path");
      expect(res.body[0]).toHaveProperty("message");
    });
  });

  describe("when the server encounters an error", () => {
    beforeAll(() => {
      jest
        .spyOn(projectService, "getProjectById")
        .mockRejectedValue(new Error("DB failure"));
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should return 500 for internal server error", async () => {
      const project = await createTestProject();

      const res = await request(app).get(`/api/projects/${project.get("id")}`);

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ message: "Internal Server Error" });
    });
  });
});
