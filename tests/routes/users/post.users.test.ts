import request from "supertest";

import { app } from "../../../src/app";
import { sequelize } from "../../../src/database/connection";
import { User } from "../../../src/database/models/user.model";
import { userSchema } from "../../../src/schemas/user.schema";
import * as userService from "../../../src/services/users/createUser.service";

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

describe("POST /users", () => {
  it("should return 201 for successful user creation", async () => {
    const res = await request(app).post("/api/users").send(newUser);
    expect(res.statusCode).toBe(201);
  });

  it("should create a new user", async () => {
    await request(app).post("/api/users").send(newUser);

    const userInDb = await User.findOne({ where: { email: newUser.email } });
    expect(userInDb).not.toBeNull();
    expect(userInDb?.get("email")).toBe(newUser.email);
  });

  it("should return the user", async () => {
    const res = await request(app).post("/api/users").send(newUser);

    const parsedUser = userSchema.parse(res.body);

    expect(parsedUser).toMatchObject({
      email: newUser.email,
      nickname: newUser.nickname,
      sub: newUser.sub,
    });
  });

  describe("when the user already exists", () => {
    it("should return 200", async () => {
      await User.create(newUser);

      const res = await request(app).post("/api/users").send(newUser);

      expect(res.statusCode).toBe(200);
    });

    it("should return the user", async () => {
      await User.create(newUser);
      const res = await request(app).post("/api/users").send(newUser);

      const parsedUser = userSchema.parse(res.body);

      expect(parsedUser).toMatchObject({
        email: newUser.email,
        nickname: newUser.nickname,
        sub: newUser.sub,
      });
    });
  });

  describe("when invalid request data is provided", () => {
    it("should return 400 for invalid user data", async () => {
      const invalidUser = { email: "" };

      const res = await request(app).post("/api/users").send(invalidUser);

      expect(res.statusCode).toBe(400);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toHaveProperty("path");
      expect(res.body[0]).toHaveProperty("message");
    });
  });

  describe("when the server encounters an error", () => {
    beforeAll(() => {
      jest
        .spyOn(userService, "createUser")
        .mockRejectedValue(new Error("DB failure"));
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should return 500 for internal server error", async () => {
      const res = await request(app).post("/api/users").send(newUser);

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ message: "Internal Server Error" });
    });
  });
});
/*

  describe("when authentication or authorization fails", () => {
    it("should return 401 if no token is provided", async () => {});
    it("should return 403 if the requester is not an admin", async () => {});
  });
    */
