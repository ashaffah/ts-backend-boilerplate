import { expect, test, vi } from "vitest";
import * as userRepository from "../repositories/user.repository";
import { UserDto } from "../dtos/user.dto";
import {
  getUserByIdService,
  getUsersService,
  createUserService,
  updateUserService,
  softDeleteUserService,
  deleteUserService,
} from "../services/user.service";
import { NOW_EPOCH } from "~/core/constant";

test("getUserByIdService calls getUserById and returns user", async () => {
  const mockUser = {
    id: "1",
    name: "Test User",
    email: "test@example.com",
    createdAt: NOW_EPOCH,
    updatedAt: null,
    deletedAt: null,
  };
  vi.spyOn(userRepository, "getUserById").mockResolvedValue(mockUser);

  const result = await getUserByIdService("1");
  expect(userRepository.getUserById).toHaveBeenCalledWith("1");
  expect(result).toEqual(mockUser);
});

test("getUsersService calls getUsers and returns users", async () => {
  const mockUsers = {
    data: [
      {
        id: "1",
        name: "Test User",
        email: "test@example.com",
        createdAt: NOW_EPOCH,
        updatedAt: null,
        deletedAt: null,
      },
    ],
    meta: { total: 1, page: 1, per_page: 10, total_pages: 1 },
  };
  vi.spyOn(userRepository, "getUsers").mockResolvedValue(mockUsers);

  const params = {
    page: "1",
    per_page: "10",
    search: "",
    order: "asc" as const,
    sort: "createdAt",
  };
  const result = await getUsersService(params);
  expect(userRepository.getUsers).toHaveBeenCalledWith(params);
  expect(result).toEqual(mockUsers);
});

test("createUserService calls createUser and returns created user", async () => {
  const userDto: UserDto = { name: "New User" } as UserDto;
  const mockCreatedUser = {
    id: "2",
    name: "New User",
    email: "newuser@example.com",
    createdAt: NOW_EPOCH,
    updatedAt: null,
    deletedAt: null,
  };
  vi.spyOn(userRepository, "createUser").mockResolvedValue(mockCreatedUser);

  const result = await createUserService(userDto);
  expect(userRepository.createUser).toHaveBeenCalledWith(userDto);
  expect(result).toEqual(mockCreatedUser);
});

test("updateUserService calls updateUser and returns updated user", async () => {
  const mockUpdatedUser = {
    id: "1",
    name: "Updated User",
    email: "updateduser@example.com",
    createdAt: NOW_EPOCH,
    updatedAt: NOW_EPOCH,
    deletedAt: null,
  };
  vi.spyOn(userRepository, "updateUser").mockResolvedValue(mockUpdatedUser);

  const result = await updateUserService("1", { name: "Updated User" });
  expect(userRepository.updateUser).toHaveBeenCalledWith("1", { name: "Updated User" });
  expect(result).toEqual(mockUpdatedUser);
});

test("softDeleteUserService calls softDeleteUser and returns result", async () => {
  const mockSoftDeletedUser = {
    id: "1",
    name: "Test User",
    email: "test@example.com",
    createdAt: NOW_EPOCH,
    updatedAt: NOW_EPOCH,
    deletedAt: NOW_EPOCH,
  };
  vi.spyOn(userRepository, "softDeleteUser").mockResolvedValue(mockSoftDeletedUser);

  const result = await softDeleteUserService("1");
  expect(userRepository.softDeleteUser).toHaveBeenCalledWith("1");
  expect(result).toEqual(mockSoftDeletedUser);
});

test("deleteUserService calls deleteUser and returns result", async () => {
  const mockDeletedUser = {
    id: "1",
    name: "Test User",
    email: "test@example.com",
    createdAt: NOW_EPOCH,
    updatedAt: NOW_EPOCH,
    deletedAt: NOW_EPOCH,
  };
  vi.spyOn(userRepository, "deleteUser").mockResolvedValue(mockDeletedUser);

  const result = await deleteUserService("1");
  expect(userRepository.deleteUser).toHaveBeenCalledWith("1");
  expect(result).toEqual(mockDeletedUser);
});
