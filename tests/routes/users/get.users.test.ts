import request from "supertest";
import z from "zod";

import * as userService from "../../../src/services/users/getAllUsers.service";
import { app } from "../../../src/app";
import { userSchema } from "../../../src/schemas/user.schema";

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

describe("GET /users", () => {
  it("should respond with 200", async () => {
    const res = await request(app).get("/api/users");
    expect(res.statusCode).toBe(200);
  });

  it("should return a list of all users", async () => {
    const res = await request(app).get("/api/users");
    z.array(userSchema).parse(res.body);
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
