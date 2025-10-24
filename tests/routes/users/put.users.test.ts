import request from "supertest";

import { app } from "../../../src/app";
import { sequelize } from "../../../src/database/connection";
import { User } from "../../../src/database/models/user.model";
import { userSchema } from "../../../src/schemas/user.schema";
import * as userService from "../../../src/services/users/updateUser.service";

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

describe("PUT /users/:id", () => {
  it("should return 200 for successful user update", async () => {
    const user = await User.create(newUser);

    const updatedData = {
      nickname: "updated.nickname",
      name: "Updated Name",
    };

    const res = await request(app)
      .put(`/api/users/${user.get("id")}`)
      .send(updatedData);

    expect(res.statusCode).toBe(200);
  });

  it("should update the user in the database", async () => {
    const user = await User.create(newUser);

    const updatedData = {
      nickname: "updated.nickname",
      name: "Updated Name",
    };

    await request(app)
      .put(`/api/users/${user.get("id")}`)
      .send(updatedData);

    const userInDb = await User.findByPk(user.get("id") as number);
    expect(userInDb).not.toBeNull();
    expect(userInDb?.get("nickname")).toBe(updatedData.nickname);
    expect(userInDb?.get("name")).toBe(updatedData.name);
  });

  it("should return the updated user", async () => {
    const user = await User.create(newUser);

    const updatedData = {
      nickname: "updated.nickname",
      name: "Updated Name",
    };

    const res = await request(app)
      .put(`/api/users/${user.get("id")}`)
      .send(updatedData);

    const parsedUser = userSchema.parse(res.body);

    expect(parsedUser).toMatchObject({
      nickname: updatedData.nickname,
      name: updatedData.name,
      email: newUser.email,
    });
  });

  describe("when the user does not exist", () => {
    it("should return 404", async () => {
      const nonExistentId = 99999;

      const updatedData = {
        nickname: "updated.nickname",
      };

      const res = await request(app)
        .put(`/api/users/${nonExistentId}`)
        .send(updatedData);

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("message");
    });
  });

  describe("when invalid request data is provided", () => {
    it("should return 400 for invalid user id", async () => {
      const invalidId = "invalid-id";

      const updatedData = {
        nickname: "updated.nickname",
      };

      const res = await request(app)
        .put(`/api/users/${invalidId}`)
        .send(updatedData);

      expect(res.statusCode).toBe(400);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toHaveProperty("path");
      expect(res.body[0]).toHaveProperty("message");
    });

    it("should return 400 for invalid update data", async () => {
      const user = await User.create(newUser);

      const invalidData = {
        email: "not-an-email",
      };

      const res = await request(app)
        .put(`/api/users/${user.get("id")}`)
        .send(invalidData);

      expect(res.statusCode).toBe(400);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toHaveProperty("path");
      expect(res.body[0]).toHaveProperty("message");
    });
  });

  describe("when the server encounters an error", () => {
    beforeAll(() => {
      jest
        .spyOn(userService, "updateUser")
        .mockRejectedValue(new Error("DB failure"));
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should return 500 for internal server error", async () => {
      const user = await User.create(newUser);

      const updatedData = {
        nickname: "updated.nickname",
      };

      const res = await request(app)
        .put(`/api/users/${user.get("id")}`)
        .send(updatedData);

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
