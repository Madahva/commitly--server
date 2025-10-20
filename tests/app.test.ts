import { app } from "../src/app";

describe("App initialization", () => {
  it("should create an express app instance", () => {
    expect(app).toBeDefined();
    expect(typeof app).toBe("function");
  });
});
