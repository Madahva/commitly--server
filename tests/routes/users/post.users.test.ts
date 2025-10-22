import request from "supertest";
import z from "zod";

import { app } from "../../../src/app";
import { userSchema } from "../../../src/schemas/user.schema";

jest.mock("../../../src/services/users/createUser.service", () => ({
  createUser: jest.fn(),
}));

import { createUser } from "../../../src/services/users/createUser.service";

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
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
  beforeEach(() => {
    (createUser as jest.Mock).mockResolvedValue([newUser, true]);
  });

  it("should return 201 for successful user creation", async () => {
    const res = await request(app).post("/api/users").send(newUser);
    expect(res.statusCode).toBe(201);
  });

  it("should create a new user", async () => {
    const res = await request(app).post("/api/users").send(newUser);
    expect(createUser).toHaveBeenCalledWith(newUser);
  });

  it("should return the user", async () => {
    const res = await request(app).post("/api/users").send(newUser);

    userSchema.parse(res.body);

    expect(res.body).toEqual(newUser);
  });

  describe("when the user already exists", () => {
    beforeEach(() => {
      (createUser as jest.Mock).mockResolvedValue([newUser, false]);
    });

    it("should return 200", async () => {
      const res = await request(app).post("/api/users").send(newUser);

      expect(res.statusCode).toBe(200);
    });

    it("should return the user", async () => {
      const res = await request(app).post("/api/users").send(newUser);

      userSchema.parse(res.body);

      expect(res.body).toEqual(newUser);
    });
  });

  describe("when invalid request data is provided", () => {
    it("should return 400", async () => {
      const invalidUser = { email: "" };

      const res = await request(app).post("/api/users").send(invalidUser);

      expect(res.statusCode).toBe(400);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toHaveProperty("path");
      expect(res.body[0]).toHaveProperty("message");
    });
  });

  describe("when the server encounters an error", () => {
    it("should return 500 for internal server error", async () => {
      (createUser as jest.Mock).mockRejectedValue(new Error("DB failure"));

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
