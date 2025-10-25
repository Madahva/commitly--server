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
});
