import request from "supertest";

import { app } from "../../../src/app";
import { sequelize } from "../../../src/database/connection";
import { User } from "../../../src/database/models/user.model";

beforeAll(async () => {
  await sequelize.sync({ force: true });
  jest.spyOn(console, "error").mockImplementation(() => {});
});

beforeEach(async () => {
  await User.destroy({ where: {}, truncate: true });
});

afterAll(async () => {
  await sequelize.close();
});

const newUser = {
  nickname: "galarza.guillemo",
  name: "galarza.guillemo@gmail.com",
  picture:
    "https://s.gravatar.com/avatar/a82546889e072835d17847381b916902?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fga.png",
  updated_at: "2025-10-16T16:51:15.066Z",
  email: "galarza.guillemo@gmail.com",
  email_verified: false,
  sub: "auth0|63fceee13df9151a2850b65c",
};

describe("DELETE /users/:id", () => {
  it("should delete the user from the database", async () => {
    const user = await User.create(newUser);
    const userId = user.dataValues.id;
    await request(app).delete(`/api/users/${userId}`);

    const userOnDb = await User.findOne({ where: { id: userId } });
    expect(userOnDb).toBeNull();
  });

  it("should return 204 for successful user deletion", async () => {
    const user = await User.create(newUser);
    const userId = user.dataValues.id;
    const res = await request(app).delete(`/api/users/${userId}`);
    expect(res.statusCode).toBe(204);
  });

  it("should have an empty body after deleting a user", async () => {
    const user = await User.create(newUser);
    const userId = user.dataValues.id;
    const res = await request(app).delete(`/api/users/${userId}`);

    expect(res.body).toEqual({});
  });

  describe("when invalid request data is provided", () => {
    it("should return 404 if user does not exist", async () => {
      const res = await request(app).delete(`/api/users/999999`);
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("User not found");
    });

    it("should return 400", async () => {
      const invalidUserId = "one";
      const res = await request(app).delete(`/api/users/${invalidUserId}`);

      expect(res.statusCode).toBe(400);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toHaveProperty("path");
      expect(res.body[0]).toHaveProperty("message");
    });
  });
});
