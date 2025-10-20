import request from "supertest";

import { app } from "../../../src/app";

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
