import { sequelize } from "../../../src/database/connection";
import { User } from "../../../src/database/models/user.model";
import { SessionGoal } from "../../../src/database/models";
import {
  createTestSessionGoal,
  newSessionGoal,
  createTestSession,
} from "../../helpers/mockData";
import { sessionGoalSchema } from "../../../src/schemas/sessionGoal.schema";
import { createSessionGoal } from "../../../src/services/sessionGoals/createSessionGoal.service";

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

describe("createSessionGoal service", () => {
  it("should create a new SessionGoal", async () => {
    const createdGoal = await createTestSessionGoal();

    const SessionGoalInDb = await SessionGoal.findOne({
      where: { id: createdGoal[0].id },
    });

    expect(SessionGoalInDb).not.toBeNull();
    expect(SessionGoalInDb?.get("name")).toBe(`${newSessionGoal.name} 1`);
  });

  it("should return the created session", async () => {
    const createdSessionGoal = await createTestSessionGoal();
    const parsedSessionGoal = sessionGoalSchema.parse(
      createdSessionGoal[0].toJSON()
    );

    expect(parsedSessionGoal).toMatchObject({
      name: `${newSessionGoal.name} 1`,
      description: newSessionGoal.description,
      status: newSessionGoal.status,
    });
  });

  it("should allow creating multiple porjectGoals for the same Session", async () => {
    const Session = await createTestSession();
    const sessionId = Session.toJSON().id;
    const SessionGoalData = { sessionId, ...newSessionGoal };

    await createSessionGoal(SessionGoalData);
    await createSessionGoal(SessionGoalData);

    const SessionGoalsInDb = await SessionGoal.findAll({
      where: { name: newSessionGoal.name },
    });

    expect(SessionGoalsInDb).toHaveLength(2);
  });
});
