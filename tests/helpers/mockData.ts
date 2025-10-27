import { User } from "../../src/database/models";
import { Project } from "../../src/database/models";
import { Session } from "../../src/database/models";
import { ProjectGoal } from "../../src/database/models";

export const newUser = {
  nickname: "galarza.guillemo",
  name: "galarza.guillemo@gmail.com",
  picture:
    "https://s.gravatar.com/avatar/a82546889e072835d17847381b916902?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fga.png",
  updatedAt: "2025-10-16T16:51:15.066Z",
  email: "galarza.guillemo@gmail.com",
  emailVerified: false,
  sub: "auth0|63fceee13df9151a2850b65c",
};

export const newUser2 = {
  nickname: "galarza.guillemo",
  name: "galarza.guillemo@gmail.com",
  picture:
    "https://s.gravatar.com/avatar/a82546889e072835d17847381b916902?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fga.png",
  updatedAt: "2025-10-16T16:51:15.066Z",
  email: "galarza.guillermo@gmail.com",
  emailVerified: false,
  sub: "auth0|62fceee13df9151a2850b65c",
};

export const newProject = {
  name: "some project name",
  description: "some project description",
  color: "#8B5CF6",
  isActive: false,
  trackTime: false,
};

export const newSession = {
  name: "Morning coding session",
  description: "Working on new features",
  note: "Made good progress",
  durationMinutes: 120,
};

export const newProjectGoal = {
  name: "some project goal name",
  description: "some project goal description",
  status: "pending" as const,
};

export const createTestUser = async () => {
  const user = await User.create(newUser);
  return user.toJSON().id;
};

export const createTestProject = async () => {
  const userId = await createTestUser();
  const project = await Project.create({ userId, ...newProject });
  return project;
};

export const createTestSession = async () => {
  const project = await createTestProject();
  const projectId = project.toJSON().id;
  const session = await Session.create({ projectId, ...newSession });
  return session;
};

export const createTestProjectGoal = async () => {
  const project = await createTestProject();
  const projectId = project.toJSON().id;
  const projectGoal = await ProjectGoal.create({
    projectId,
    ...newProjectGoal,
  });

  return projectGoal;
};
