import { validateRequest } from "../../src/middlewares/validateRequestSchema.middleware";
import { z, ZodObject } from "zod";
import type { Request, Response, NextFunction } from "express";

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

describe("validateRequest middleware", () => {
  const mockSchema = z.object({
    body: z.object({
      name: z.string(),
    }),
  });

  const mockReq = (body: unknown): Partial<Request> => ({
    body,
    params: {},
    query: {},
  });

  const mockRes = (): Partial<Response> => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  const mockNext = (): NextFunction => jest.fn();

  it("should call next() if validation passes", () => {
    const req = mockReq({ name: "Guille" }) as Request;
    const res = mockRes() as Response;
    const next = mockNext();

    validateRequest(mockSchema as ZodObject)(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it("should respond with 400 if validation fails", () => {
    const req = mockReq({}) as Request;
    const res = mockRes() as Response;
    const next = mockNext();

    validateRequest(mockSchema as ZodObject)(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ message: expect.any(String) }),
      ]),
    );
  });

  it("should respond with 500 on non-Zod errors", () => {
    const schema = {
      parse: () => {
        throw new Error("Unexpected");
      },
    } as unknown as ZodObject;

    const req = mockReq({}) as Request;
    const res = mockRes() as Response;
    const next = mockNext();

    validateRequest(schema)(req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
