import request from "supertest";
import z from "zod";

import * as userService from "../../src/services/users/getAllUsers.service";
import { app } from "../../src/app";
import { userSchema } from "../../src/schemas/user.schema";

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

describe("POST /users", () => {
  it("should return 201 for successful user creation", async () => {});

  it("should create a new user", async () => {});

  it("should return the user", async () => {});

  describe("when the user already exists", () => {
    it("should return 200", async () => {});

    it("should return the user", async () => {});
  });

  describe("when invalid request data is provided", () => {
    it("should return 400", async () => {});
  });

  describe("when the server encounters an error", () => {
    it("should return 500 for internal server error", async () => {});
  });

  /*

  describe("when authentication or authorization fails", () => {
    it("should return 401 if no token is provided", async () => {});
    it("should return 403 if the requester is not an admin", async () => {});
  });
    */
});
