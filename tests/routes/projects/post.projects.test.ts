import { Project } from "../../../src/database/models/project.model";
import { sequelize } from "../../../src/database/connection";
import { createProject } from "../../../src/services/project/createProject.service";

beforeAll(async () => {
  await sequelize.sync({ force: true });
  jest.spyOn(console, "error").mockImplementation(() => {});
});

beforeEach(async () => {
  await Project.destroy({ where: {}, truncate: true });
});

afterAll(async () => {
  await sequelize.close();
});

const newProject = {
  name: "some project name",
  description: "some project description",
  color: "#8B5CF6",
  isActive: false,
  track_time: false,
};

describe("createProject service", () => {
  it("should create a new project", async () => {
    await createProject(newProject);

    const projectInDb = await Project.findOne({
      where: { name: newProject.name },
    });

    expect(projectInDb).not.toBeNull();
    expect(projectInDb?.get("name")).toBe(newProject.name);
  });

  it("should return the created project", async () => {
    const createdProject = await createProject(newProject);

    expect(createdProject.toJSON()).toMatchObject({
      name: newProject.name,
      description: newProject.description,
      color: newProject.color,
      isActive: newProject.isActive,
      track_time: newProject.track_time,
    });
  });

  it("should not create a duplicate", async () => {
    await createProject(newProject);

    await expect(createProject(newProject)).rejects.toThrow();

    const projectsInDb = await Project.findAll({
      where: { name: newProject.name },
    });

    expect(projectsInDb).toHaveLength(1);
  });
});
