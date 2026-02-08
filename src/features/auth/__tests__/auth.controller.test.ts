import { expect, test, vi } from "vitest";
import * as authService from "../services/auth.service";
import { loginController, registerController } from "../controllers/auth.controller";
import * as jwtMiddleware from "~/core/middleware";

test("loginController returns token", async () => {
  vi.spyOn(jwtMiddleware, "signAccessToken").mockResolvedValue("mock-token");
  vi.spyOn(authService, "loginService").mockResolvedValue({
    message: "Login successful",
  });

  const req = { body: { email: "user@example.com", password: "password123" } };
  const reply = { send: vi.fn() };

  await loginController(req as never, reply as never);
  expect(authService.loginService).toHaveBeenCalledWith({
    email: "user@example.com",
    password: "password123",
  });
  expect(reply.send).toHaveBeenCalledWith({ message: "Login successful", token: "mock-token" });
});

test("registerController returns user", async () => {
  const mockUser = {
    email: "user@example.com",
    name: null,
    id: "1",
    createdAt: BigInt(Date.now()),
    updatedAt: null,
    deletedAt: null,
  };
  const mockRegisterResult = {
    message: "Register successful",
    user: mockUser,
  };
  vi.spyOn(authService, "registerService").mockResolvedValue(mockRegisterResult);

  const req = { body: { email: "user@example.com", password: "password123" } };
  const reply = { send: vi.fn() };

  await registerController(req as never, reply as never);
  expect(authService.registerService).toHaveBeenCalledWith({
    email: "user@example.com",
    password: "password123",
  });
  expect(reply.send).toHaveBeenCalledWith(mockRegisterResult);
});
