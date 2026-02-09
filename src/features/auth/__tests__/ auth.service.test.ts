import { expect, test, vi } from "vitest";
import * as authRepository from "../repositories/auth.repository";
import { loginService, registerService } from "../services/auth.service";
import { NOW_EPOCH } from "~/core/constant";
import * as jwtMiddleware from "~/core/middleware";
import * as passwordUtil from "~/core/utils";

test("loginService calls login and returns token", async () => {
  const mockUser = {
    email: "user@example.com",
    name: null,
    id: "1",
    password: "hashed-password",
    createdAt: NOW_EPOCH,
    updatedAt: null,
    deletedAt: null,
  };
  vi.spyOn(authRepository, "signIn").mockResolvedValue(mockUser);
  vi.spyOn(jwtMiddleware, "signAccessToken").mockResolvedValue("mock-token");
  vi.spyOn(passwordUtil, "verifyPassword").mockResolvedValue(true);

  const result = await loginService({ email: "user@example.com", password: "password123" });
  expect(authRepository.signIn).toHaveBeenCalledWith("user@example.com");
  expect(result).toEqual({ message: "Login successful" });
});

test("registerService calls register and returns user", async () => {
  const mockUser = {
    email: "user@example.com",
    name: null,
    id: "1",
    createdAt: NOW_EPOCH,
    updatedAt: null,
    deletedAt: null,
    password: "hashed-password",
  };
  vi.spyOn(authRepository, "signUp").mockResolvedValue(mockUser);

  const result = await registerService({ email: "user@example.com", password: "123456" });
  expect(authRepository.signUp).toHaveBeenCalledWith({
    email: "user@example.com",
    password: expect.any(String),
  });
  expect(result).toEqual({
    message: "Register successful",
    user: mockUser,
  });
});
