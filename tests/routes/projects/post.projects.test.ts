import request from "supertest";

import { app } from "../../../src/app";
import { Project } from "../../../src/database/models/project.model";
import { User } from "../../../src/database/models/user.model";
import { projectSchema } from "../../../src/schemas/project.schema";
import { sequelize } from "../../../src/database/connection";
import { createProject } from "../../../src/services/projects/createProject.service";
import * as projectService from "../../../src/services/projects/createProject.service";
import {
  newProject,
  createTestProject,
  createTestUser,
} from "../../helpers/mockData";

beforeAll(async () => {
  await sequelize.sync({ force: true });
  jest.spyOn(console, "error").mockImplementation(() => {});
});

beforeEach(async () => {
  await User.destroy({ where: {}, truncate: true, cascade: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("createProject service", () => {
  it("should create a new project", async () => {
    await createTestProject();

    const projectInDb = await Project.findOne({
      where: { name: newProject.name },
    });

    expect(projectInDb).not.toBeNull();
    expect(projectInDb?.get("name")).toBe(newProject.name);
  });

  it("should return the created project", async () => {
    const createdProject = await createTestProject();
    const parsedProject = projectSchema.parse(createdProject.toJSON());

    expect(parsedProject).toMatchObject({
      name: newProject.name,
      description: newProject.description,
      color: newProject.color,
      isActive: newProject.isActive,
      trackTime: newProject.trackTime,
    });
  });

  it("should not create a duplicate", async () => {
    const userId = await createTestUser();
    const projectData = { userId, ...newProject };

    await createProject(projectData);

    await expect(createProject(projectData)).rejects.toThrow();

    const projectsInDb = await Project.findAll({
      where: { name: newProject.name },
    });

    expect(projectsInDb).toHaveLength(1);
  });
});

describe("POST /projects", () => {
  it("should respond with 201", async () => {
    const userId = await createTestUser();

    const res = await request(app)
      .post("/api/projects")
      .send({ userId, ...newProject });

    expect(res.statusCode).toBe(201);
  });

  it("should return the created project", async () => {
    const userId = await createTestUser();

    const res = await request(app)
      .post("/api/projects")
      .send({ userId, ...newProject });

    const parsedProject = projectSchema.parse(res.body);

    expect(parsedProject).toMatchObject({
      name: newProject.name,
      description: newProject.description,
      color: newProject.color,
      isActive: newProject.isActive,
      trackTime: newProject.trackTime,
    });
  });

  describe("when invalid request data is provided", () => {
    it("should return 400 for invalid user data", async () => {
      const invalidProject = { name: "" };

      const res = await request(app).post("/api/projects").send(invalidProject);

      expect(res.statusCode).toBe(400);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toHaveProperty("path");
      expect(res.body[0]).toHaveProperty("message");
    });
  });

  describe("when the server encounters an error", () => {
    beforeAll(() => {
      jest
        .spyOn(projectService, "createProject")
        .mockRejectedValue(new Error("DB failure"));
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should return 500 for internal server error", async () => {
      const userId = await createTestUser();

      const res = await request(app)
        .post("/api/projects")
        .send({ userId, ...newProject });

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ message: "Internal Server Error" });
    });
  });
});
