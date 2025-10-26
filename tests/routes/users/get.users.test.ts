import request from "supertest";
import z from "zod";

import { sequelize } from "../../../src/database/connection";
import * as userService from "../../../src/services/users/getAllUsers.service";
import { app } from "../../../src/app";
import { userSchema } from "../../../src/schemas/user.schema";
import { User } from "../../../src/database/models/user.model";
import { newUser, newUser2 } from "../../helpers/mockData";

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

  describe("when the server encounters an error", () => {
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
