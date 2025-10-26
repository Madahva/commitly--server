import request from "supertest";

import { sequelize } from "../../../src/database/connection";
import { app } from "../../../src/app";
import { User } from "../../../src/database/models/user.model";
import { Project } from "../../../src/database/models/project.model";
import * as projectService from "../../../src/services/projects/deleteProject.service";
import { createTestProject } from "../../helpers/mockData";

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

describe("DELETE /projects/:id", () => {
  it("should respond with 204 status code", async () => {
    const project = await createTestProject();

    const res = await request(app).delete(`/api/projects/${project.get("id")}`);

    expect(res.statusCode).toBe(204);
  });

  it("should delete the project from database", async () => {
    const project = await createTestProject();
    const projectId = project.get("id");

    await request(app).delete(`/api/projects/${projectId}`);

    const deletedProject = await Project.findByPk(projectId);
    expect(deletedProject).toBeNull();
  });

  describe("when the project does not exist", () => {
    it("should return 404 if project does not exist", async () => {
      const res = await request(app).delete(`/api/projects/999999`);

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Project not found");
    });
  });

  describe("when invalid request data is provided", () => {
    it("should return 400 for invalid project ID", async () => {
      const invalidProjectId = "one";

      const res = await request(app).delete(
        `/api/projects/${invalidProjectId}`
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
        .spyOn(projectService, "deleteProject")
        .mockRejectedValue(new Error("DB failure"));
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should return 500 for internal server error", async () => {
      const project = await createTestProject();

      const res = await request(app).delete(
        `/api/projects/${project.get("id")}`
      );

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ message: "Internal Server Error" });
    });
  });
});
