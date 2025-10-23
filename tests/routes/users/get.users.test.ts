import request from "supertest";
import z from "zod";

import { sequelize } from "../../../src/database/connection";
import * as userService from "../../../src/services/users/getAllUsers.service";
import { app } from "../../../src/app";
import { userSchema } from "../../../src/schemas/user.schema";
import { User } from "../../../src/database/models/user.model";

beforeAll(async () => {
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

const newUser2 = {
  nickname: "galarza.guillemo",
  name: "galarza.guillemo@gmail.com",
  picture:
    "https://s.gravatar.com/avatar/a82546889e072835d17847381b916902?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fga.png",
  updated_at: "2025-10-16T16:51:15.066Z",
  email: "galarza.guillermo@gmail.com",
  email_verified: false,
  sub: "auth0|62fceee13df9151a2850b65c",
};

describe("GET /users", () => {
  it("should respond with 200", async () => {
    const res = await request(app).get("/api/users");
    expect(res.statusCode).toBe(200);
  });

  it("should return a list of all users", async () => {
    await User.create(newUser);
    await User.create(newUser2);

    const res = await request(app).get("/api/users");

    const parsedUsers = z.array(userSchema).parse(res.body);

    expect(Array.isArray(parsedUsers)).toBe(true);
    expect(parsedUsers.length).toBeGreaterThan(0);
  });

  it("should return an empty array when there are no users", async () => {
    const res = await request(app).get("/api/users");

    const parsedUsers = z.array(userSchema).parse(res.body);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(parsedUsers)).toBe(true);
    expect(parsedUsers).toHaveLength(0);
  });

  describe("Error handling", () => {
    it("should return 500 when the server encounters an internal error", async () => {
      jest
        .spyOn(userService, "getAllUsersService")
        .mockImplementationOnce(() => {
          throw new Error("Database failure");
        });

      const res = await request(app).get("/api/users");

      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty("message", "Internal Server Error");

      jest.restoreAllMocks();
    });
    /*
    it("should return 403 when the requester is not an admin", () => {
      // test implementation
    });
     */
  });
});
