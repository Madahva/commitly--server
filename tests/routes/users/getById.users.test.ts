import request from "supertest";

import { sequelize } from "../../../src/database/connection";
import { app } from "../../../src/app";
import { User } from "../../../src/database/models/user.model";
import * as userService from "../../../src/services/users/getUserById.service";
import { userSchema } from "../../../src/schemas/user.schema";

beforeAll(async () => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  await sequelize.sync({ force: true });
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

describe("GET /users/:id", () => {
  it("should respond with 200 status code", async () => {
    const user = await User.create(newUser);
    const res = await request(app).get(`/api/users/${user.get("id")}`);

    expect(res.statusCode).toBe(200);
  });

  it("should return the user", async () => {
    const user = await User.create(newUser);
    const res = await request(app).get(`/api/users/${user.get("id")}`);
    const parsedUser = userSchema.parse(res.body);

    expect(parsedUser).toMatchObject({
      id: user.get("id"),
      email: newUser.email,
      nickname: newUser.nickname,
      sub: newUser.sub,
    });
  });

  describe("when the user does not exist", () => {
    it("should return 404 if user does not exist", async () => {
      const res = await request(app).get(`/api/users/999999`);
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("User not found");
    });
  });

  describe("when invalid request data is provided", () => {
    it("should return 400", async () => {
      const invalidUserId = "one";
      const res = await request(app).get(`/api/users/${invalidUserId}`);

      expect(res.statusCode).toBe(400);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toHaveProperty("path");
      expect(res.body[0]).toHaveProperty("message");
    });
  });

  describe("when the server encounters an error", () => {
    beforeAll(() => {
      jest
        .spyOn(userService, "getUserById")
        .mockRejectedValue(new Error("DB failure"));
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should return 500 for internal server error", async () => {
      const user = await User.create(newUser);

      const res = await request(app).get(`/api/users/${user.get("id")}`);

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ message: "Internal Server Error" });
    });
  });
});
