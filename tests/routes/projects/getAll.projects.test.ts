import request from "supertest";

import { sequelize } from "../../../src/database/connection";
import { app } from "../../../src/app";
import { User } from "../../../src/database/models/user.model";
import { Project } from "../../../src/database/models/project.model";
import * as projectService from "../../../src/services/projects/getAllProjects.service";
import { projectSchema } from "../../../src/schemas/project.schema";
import { createTestProject, newProject } from "../../helpers/mockData";

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

describe("GET /projects", () => {
  it("should respond with 200 status code", async () => {
    const project = await createTestProject();
    const res = await request(app).get(
      `/api/projects?userId=${project.get("userId")}`
    );

    expect(res.statusCode).toBe(200);
  });

  it("should return all projects for a user", async () => {
    const project1 = await createTestProject();
    const userId = project1.get("userId");

    const project2 = await Project.create({
      userId,
      name: "Second Project",
      description: "Second description",
      color: "#FF0000",
      isActive: true,
      trackTime: true,
    });

    const res = await request(app).get(`/api/projects?userId=${userId}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(2);

    const parsedProjects = res.body.map((p: unknown) => projectSchema.parse(p));

    expect(parsedProjects[0]).toMatchObject({
      id: project1.get("id"),
      name: newProject.name,
    });
    expect(parsedProjects[1]).toMatchObject({
      id: project2.get("id"),
      name: "Second Project",
    });
  });

  it("should return empty array when user has no projects", async () => {
    const project = await createTestProject();
    const nonExistentUserId = project.get("userId") + 1000;

    const res = await request(app).get(
      `/api/projects?userId=${nonExistentUserId}`
    );

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(0);
  });

  describe("when invalid request data is provided", () => {
    it("should return 400 when userId is not provided", async () => {
      const res = await request(app).get(`/api/projects`);

      expect(res.statusCode).toBe(400);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toHaveProperty("path");
      expect(res.body[0]).toHaveProperty("message");
    });

    it("should return 400 when userId is invalid", async () => {
      const res = await request(app).get(`/api/projects?userId=invalid`);

      expect(res.statusCode).toBe(400);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toHaveProperty("path");
      expect(res.body[0]).toHaveProperty("message");
    });

    it("should return 400 when userId is negative", async () => {
      const res = await request(app).get(`/api/projects?userId=-1`);

      expect(res.statusCode).toBe(400);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("when the server encounters an error", () => {
    beforeAll(() => {
      jest
        .spyOn(projectService, "getAllProjects")
        .mockRejectedValue(new Error("DB failure"));
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should return 500 for internal server error", async () => {
      const project = await createTestProject();

      const res = await request(app).get(
        `/api/projects?userId=${project.get("userId")}`
      );

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ message: "Internal Server Error" });
    });
  });
});
