import request from "supertest";

import { sequelize } from "../../../src/database/connection";
import { app } from "../../../src/app";
import { User } from "../../../src/database/models/user.model";
import * as projectService from "../../../src/services/projects/updateProject.service";
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

describe("PUT /projects/:id", () => {
  it("should respond with 200 status code", async () => {
    const project = await createTestProject();
    const updatedData = { name: "Updated Project Name" };

    const res = await request(app)
      .put(`/api/projects/${project.get("id")}`)
      .send(updatedData);

    expect(res.statusCode).toBe(200);
  });

  it("should return the updated project", async () => {
    const project = await createTestProject();
    const updatedData = {
      name: "Updated Project Name",
      description: "Updated description",
      color: "#FF5733",
    };

    const res = await request(app)
      .put(`/api/projects/${project.get("id")}`)
      .send(updatedData);

    const parsedProject = projectSchema.parse(res.body);

    expect(parsedProject).toMatchObject({
      id: project.get("id"),
      name: updatedData.name,
      description: updatedData.description,
      color: updatedData.color,
      isActive: newProject.isActive,
      trackTime: newProject.trackTime,
    });
  });

  it("should allow partial updates", async () => {
    const project = await createTestProject();
    const updatedData = { name: "Only Name Updated" };

    const res = await request(app)
      .put(`/api/projects/${project.get("id")}`)
      .send(updatedData);

    const parsedProject = projectSchema.parse(res.body);

    expect(parsedProject).toMatchObject({
      id: project.get("id"),
      name: updatedData.name,
      description: newProject.description,
      color: newProject.color,
      isActive: newProject.isActive,
      trackTime: newProject.trackTime,
    });
  });

  describe("when the project does not exist", () => {
    it("should return 404 if project does not exist", async () => {
      const updatedData = { name: "Updated Name" };
      const res = await request(app)
        .put(`/api/projects/999999`)
        .send(updatedData);

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Project not found");
    });
  });

  describe("when invalid request data is provided", () => {
    it("should return 400 for invalid project ID", async () => {
      const invalidProjectId = "one";
      const updatedData = { name: "Updated Name" };

      const res = await request(app)
        .put(`/api/projects/${invalidProjectId}`)
        .send(updatedData);

      expect(res.statusCode).toBe(400);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toHaveProperty("path");
      expect(res.body[0]).toHaveProperty("message");
    });

    it("should return 400 for invalid color format", async () => {
      const project = await createTestProject();
      const invalidData = { color: "invalid-color" };

      const res = await request(app)
        .put(`/api/projects/${project.get("id")}`)
        .send(invalidData);

      expect(res.statusCode).toBe(400);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("when the server encounters an error", () => {
    beforeAll(() => {
      jest
        .spyOn(projectService, "updateProject")
        .mockRejectedValue(new Error("DB failure"));
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should return 500 for internal server error", async () => {
      const project = await createTestProject();
      const updatedData = { name: "Updated Name" };

      const res = await request(app)
        .put(`/api/projects/${project.get("id")}`)
        .send(updatedData);

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ message: "Internal Server Error" });
    });
  });
});
