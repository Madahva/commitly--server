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
      id: project2.get("id"),
      name: "Second Project",
    });
    expect(parsedProjects[1]).toMatchObject({
      id: project1.get("id"),
      name: newProject.name,
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

  describe("filtering", () => {
    it("should filter by isActive=true", async () => {
      const project1 = await createTestProject();
      const userId = project1.get("userId");

      await Project.create({
        userId,
        name: "Inactive Project",
        description: "desc",
        color: "#FF0000",
        isActive: false,
        trackTime: false,
      });

      const res = await request(app).get(
        `/api/projects?userId=${userId}&isActive=true`
      );

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(0);
    });

    it("should filter by isActive=false", async () => {
      const project1 = await createTestProject();
      const userId = project1.get("userId");

      await Project.create({
        userId,
        name: "Inactive Project",
        description: "desc",
        color: "#FF0000",
        isActive: false,
        trackTime: false,
      });

      const res = await request(app).get(
        `/api/projects?userId=${userId}&isActive=false`
      );

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(2);
    });

    it("should filter by trackTime=true", async () => {
      const project1 = await createTestProject();
      const userId = project1.get("userId");

      await Project.create({
        userId,
        name: "Time Tracked Project",
        description: "desc",
        color: "#FF0000",
        isActive: true,
        trackTime: true,
      });

      const res = await request(app).get(
        `/api/projects?userId=${userId}&trackTime=true`
      );

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].name).toBe("Time Tracked Project");
    });

    it("should filter by trackTime=false", async () => {
      const project1 = await createTestProject();
      const userId = project1.get("userId");

      await Project.create({
        userId,
        name: "Time Tracked Project",
        description: "desc",
        color: "#FF0000",
        isActive: true,
        trackTime: true,
      });

      const res = await request(app).get(
        `/api/projects?userId=${userId}&trackTime=false`
      );

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].name).toBe(newProject.name);
    });

    it("should search by name (case-insensitive)", async () => {
      const project1 = await createTestProject();
      const userId = project1.get("userId");

      await Project.create({
        userId,
        name: "Marketing Campaign",
        description: "desc",
        color: "#FF0000",
        isActive: true,
        trackTime: true,
      });

      await Project.create({
        userId,
        name: "Sales Dashboard",
        description: "desc",
        color: "#00FF00",
        isActive: true,
        trackTime: true,
      });

      const res = await request(app).get(
        `/api/projects?userId=${userId}&name=marketing`
      );

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].name).toBe("Marketing Campaign");
    });

    it("should combine multiple filters", async () => {
      const project1 = await createTestProject();
      const userId = project1.get("userId");

      await Project.create({
        userId,
        name: "Active Tracked Project",
        description: "desc",
        color: "#FF0000",
        isActive: true,
        trackTime: true,
      });

      await Project.create({
        userId,
        name: "Active Untracked Project",
        description: "desc",
        color: "#00FF00",
        isActive: true,
        trackTime: false,
      });

      const res = await request(app).get(
        `/api/projects?userId=${userId}&isActive=true&trackTime=true`
      );

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].name).toBe("Active Tracked Project");
    });
  });

  describe("pagination", () => {
    it("should paginate results with limit", async () => {
      const project1 = await createTestProject();
      const userId = project1.get("userId");

      await Project.create({
        userId,
        name: "Project 2",
        description: "desc",
        color: "#FF0000",
        isActive: true,
        trackTime: true,
      });

      await Project.create({
        userId,
        name: "Project 3",
        description: "desc",
        color: "#00FF00",
        isActive: true,
        trackTime: true,
      });

      const res = await request(app).get(
        `/api/projects?userId=${userId}&limit=2`
      );

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(2);
    });

    it("should paginate results with limit and offset", async () => {
      const project1 = await createTestProject();
      const userId = project1.get("userId");

      await Project.create({
        userId,
        name: "Project 2",
        description: "desc",
        color: "#FF0000",
        isActive: true,
        trackTime: true,
      });

      await Project.create({
        userId,
        name: "Project 3",
        description: "desc",
        color: "#00FF00",
        isActive: true,
        trackTime: true,
      });

      const res = await request(app).get(
        `/api/projects?userId=${userId}&limit=1&offset=1`
      );

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].name).toBe("Project 2");
    });
  });

  describe("sorting", () => {
    it("should sort by name ASC", async () => {
      const project1 = await createTestProject();
      const userId = project1.get("userId");

      await Project.create({
        userId,
        name: "Alpha Project",
        description: "desc",
        color: "#FF0000",
        isActive: true,
        trackTime: true,
      });

      await Project.create({
        userId,
        name: "Zulu Project",
        description: "desc",
        color: "#00FF00",
        isActive: true,
        trackTime: true,
      });

      const res = await request(app).get(
        `/api/projects?userId=${userId}&orderBy=name&order=ASC`
      );

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(3);
      expect(res.body[0].name).toBe("Alpha Project");
      expect(res.body[2].name).toBe("Zulu Project");
    });

    it("should sort by name DESC", async () => {
      const project1 = await createTestProject();
      const userId = project1.get("userId");

      await Project.create({
        userId,
        name: "Alpha Project",
        description: "desc",
        color: "#FF0000",
        isActive: true,
        trackTime: true,
      });

      await Project.create({
        userId,
        name: "Zulu Project",
        description: "desc",
        color: "#00FF00",
        isActive: true,
        trackTime: true,
      });

      const res = await request(app).get(
        `/api/projects?userId=${userId}&orderBy=name&order=DESC`
      );

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(3);
      expect(res.body[0].name).toBe("Zulu Project");
      expect(res.body[2].name).toBe("Alpha Project");
    });

    it("should sort by createdAt DESC by default", async () => {
      const project1 = await createTestProject();
      const userId = project1.get("userId");

      await new Promise((resolve) => setTimeout(resolve, 100));

      await Project.create({
        userId,
        name: "Newer Project",
        description: "desc",
        color: "#FF0000",
        isActive: true,
        trackTime: true,
      });

      const res = await request(app).get(`/api/projects?userId=${userId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body[0].name).toBe("Newer Project");
    });
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

    it("should return 400 when limit is invalid", async () => {
      const project = await createTestProject();
      const res = await request(app).get(
        `/api/projects?userId=${project.get("userId")}&limit=invalid`
      );

      expect(res.statusCode).toBe(400);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("should return 400 when orderBy is invalid", async () => {
      const project = await createTestProject();
      const res = await request(app).get(
        `/api/projects?userId=${project.get("userId")}&orderBy=invalid`
      );

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
