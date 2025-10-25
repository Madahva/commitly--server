import request from "supertest";

import { app } from "../../../src/app";
import { sequelize } from "../../../src/database/connection";
import { User } from "../../../src/database/models/user.model";
import * as userService from "../../../src/services/users/deleteUser.service";
import { newUser } from "../../helpers/mockData";

beforeAll(async () => {
  await sequelize.sync({ force: true });
  jest.spyOn(console, "error").mockImplementation(() => {});
});

beforeEach(async () => {
  await User.destroy({ where: {}, truncate: true, cascade: true });
});

afterAll(async () => {
  await sequelize.close();
});

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

  describe("when the user does not exist", () => {
    it("should return 404", async () => {
      const res = await request(app).delete(`/api/users/999999`);
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("User not found");
    });
  });

  describe("when invalid request data is provided", () => {
    it("should return 400", async () => {
      const invalidUserId = "one";
      const res = await request(app).delete(`/api/users/${invalidUserId}`);

      expect(res.statusCode).toBe(400);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toHaveProperty("path");
      expect(res.body[0]).toHaveProperty("message");
    });
  });

  describe("when the server encounters an error", () => {
    beforeAll(() => {
      jest
        .spyOn(userService, "deleteUser")
        .mockRejectedValue(new Error("DB failure"));
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it("should return 500 for internal server error", async () => {
      const user = await User.create(newUser);

      const res = await request(app).delete(`/api/users/${user.get("id")}`);

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ message: "Internal Server Error" });
    });
  });
});
